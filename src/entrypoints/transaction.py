from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database.main import get_database
from entity.account import Account
from entity.deposit import Deposit
from entity.transaction import Transaction, TransactionPending
from entity.user import User
from entity.utile import State
from loop.main import CANCELLATION_TIMEOUT_SECONDS
from schema.transaction import TransactionSchema
from utile import get_current_user

router = APIRouter()


@router.post("/make-transaction")
def make_transaction(
    transaction: TransactionSchema,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    try:
        # Fetch sender and receiver accounts
        sender_account = db.query(Account).filter(Account.id == current_user.id).first()
        receiver_account = (
            db.query(Account)
            .filter(Account.id == transaction.id_account_receiver)
            .first()
        )

        # Validate accounts
        if not sender_account:
            raise HTTPException(status_code=404, detail="Sender account not found")
        if not receiver_account:
            raise HTTPException(status_code=404, detail="Receiver account not found")

        # Ensure sender has sufficient balance
        if sender_account.balance < transaction.amount:
            raise HTTPException(
                status_code=400, detail="Insufficient balance in sender's account"
            )

        # Ensure both accounts are active
        if not sender_account.state or not receiver_account.state:
            raise HTTPException(
                status_code=400, detail="One or both accounts are inactive"
            )

        # Ensure sender and receiver are different
        if transaction.id_account_sender == transaction.id_account_receiver:
            raise HTTPException(
                status_code=400, detail="Sender and receiver accounts must be different"
            )

        # Ensure the transaction amount is positive
        if transaction.amount <= 0:
            raise HTTPException(
                status_code=400, detail="Transaction amount must be greater than 0"
            )

        new_transaction_pending = TransactionPending(
            amount=transaction.amount,
            id_account_sender=transaction.id_account_sender,
            id_account_receiver=transaction.id_account_receiver,
            date=datetime.now(timezone.utc),
        )
        db.add(new_transaction_pending)
        db.commit()
        db.refresh(new_transaction_pending)

        return {
            "status": "success",
            "message": "Transaction completed successfully.",
        }

    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(error)}"
        ) from error

    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Unexpected error: {str(error)}"
        ) from error


@router.post("/cancel-transaction/{transaction_id}")
def cancel_transaction(
    transaction_id: int,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    try:
        # Fetch the transaction
        transaction_pending = (
            db.query(TransactionSchema)
            .filter(TransactionSchema.id == transaction_id)
            .first()
        )

        if not transaction_pending:
            raise HTTPException(status_code=404, detail="Transaction not found")

        # Ensure the transaction is in a pending state
        if transaction_pending.state != State.PENDING:
            raise HTTPException(
                status_code=400, detail="Only pending transactions can be cancelled"
            )

        # Ensure the current user has permission to cancel the transaction
        if transaction_pending.id_account_sender != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to cancel this transaction",
            )

        # Check if the cancellation window has passed
        current_time = datetime.now(timezone.utc)
        if current_time > transaction_pending.date + timedelta(
            seconds=CANCELLATION_TIMEOUT_SECONDS
        ):
            raise HTTPException(
                status_code=400, detail="Transaction cancellation window has expired"
            )

        # Update transaction state
        cancelled_transaction = Transaction(
            amount=transaction_pending.amount,
            id_account_sender=transaction_pending.id_account_sender,
            id_account_receiver=transaction_pending.id_account_receiver,
            state=State.CANCELLED,
            date=datetime.now(timezone.utc),
        )
        db.add(cancelled_transaction)

        db.delete(transaction_pending)
        db.commit()

        return {"status": "success", "message": "Transaction cancelled successfully."}

    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(error)}"
        ) from error

    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Unexpected error: {str(error)}"
        ) from error


@router.get("/transactions/{account_id}")
def get_transactions(
    account_id: int,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):

    # Verify if the account belongs to the current user
    user_accounts = db.query(Account).filter(Account.user_id == current_user.id).all()
    user_accounts_ids = {account.id for account in user_accounts}

    if account_id not in user_accounts_ids:
        raise HTTPException(
            status_code=403, detail="Access denied: Account does not belong to the user"
        )

    # Fetch transactions and deposits related to the account
    transactions = (
        db.query(Transaction)
        .filter(
            or_(
                Transaction.id_account_sender == account_id,
                Transaction.id_account_receiver == account_id,
            )
        )
        .all()
    )

    deposits = db.query(Deposit).filter(Deposit.account_id == account_id).all()

    # Combine and sort all operations by date
    combined_operations = [
        {
            "type": "transaction",
            "amount": transaction.amount,
            "sender": transaction.id_account_sender,
            "receiver": transaction.id_account_receiver,
            "state": transaction.state,
            "date": transaction.date,
        }
        for transaction in transactions
    ] + [
        {
            "type": "deposit",
            "amount": deposit.amount,
            "state": deposit.state,
            "date": deposit.date,
        }
        for deposit in deposits
    ]

    combined_operations.sort(key=lambda x: x["date"], reverse=True)

    return combined_operations
