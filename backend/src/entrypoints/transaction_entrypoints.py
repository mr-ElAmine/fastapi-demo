from datetime import timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database.main_database import get_database
from entity.account_entity import Account
from entity.beneficiary_entity import Beneficiary
from entity.deposit_entity import Deposit
from entity.transaction_entity import Transaction, TransactionAuto, TransactionPending
from entity.user_entity import User
from entity.utile_entity import FrequencyEnum, State
from loop.main_loop import CANCELLATION_TIMEOUT_SECONDS
from schema.transaction_schema import TransactionAutoCreateSchema, TransactionCreateSchema
from utile import get_current_user, get_current_utc_time

router = APIRouter()


@router.post("/make-transaction")
def make_transaction(
    transaction: TransactionCreateSchema,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    try:
        # Fetch sender and receiver accounts
        sender_account = (
            db.query(Account)
            .filter(Account.id == transaction.id_account_sender)
            .first()
        )
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

        if sender_account.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not authorised.",
            )

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

        beneficiary = (
            db.query(Beneficiary)
            .filter(
                Beneficiary.added_by_user_id == current_user.id,
                Beneficiary.beneficiary_account_id == transaction.id_account_receiver,
            )
            .first()
        )

        if not beneficiary:
            raise HTTPException(
                status_code=403,
                detail="The receiver account must be added as a beneficiary before making a transaction.",
            )

        sender_account.balance -= transaction.amount
        current_time = get_current_utc_time()

        new_transaction_pending = TransactionPending(
            amount=transaction.amount,
            id_account_sender=transaction.id_account_sender,
            id_account_receiver=transaction.id_account_receiver,
            date=current_time,
            label=transaction.label,
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
            db.query(TransactionPending)
            .filter(TransactionPending.id == transaction_id)
            .first()
        )

        if not transaction_pending:
            raise HTTPException(status_code=404, detail="Transaction not found")

        sender_account = (
            db.query(Account)
            .filter(Account.id == transaction_pending.id_account_sender)
            .first()
        )

        # Ensure the current user has permission to cancel the transaction
        if sender_account.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to cancel this transaction",
            )

        current_time = get_current_utc_time()
        transaction_date = transaction_pending.date.replace(tzinfo=timezone.utc)

        if current_time > transaction_date + timedelta(
            seconds=CANCELLATION_TIMEOUT_SECONDS
        ):
            raise HTTPException(
                status_code=400, detail="Transaction cancellation window has expired"
            )

        # Update transaction state

        sender_account.balance += transaction_pending.amount

        cancelled_transaction = Transaction(
            amount=transaction_pending.amount,
            id_account_sender=transaction_pending.id_account_sender,
            id_account_receiver=transaction_pending.id_account_receiver,
            state=State.CANCELLED,
            date=transaction_date,
            label=transaction_pending.label,
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
    account_id: str,
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
            "label": transaction.label,
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


@router.get("/transaction/{transaction_id}")
def get_transaction_by_id(
    transaction_id: int,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):

    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()

    # Verify if the transaction exists
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    account_sender = db.query(User).filter(User.id == current_user.id).first()
    account_receiver = db.query(User).filter(User.id == current_user.id).first()

    # Verify if the sender or the receiver is the current user
    if current_user.id not in [account_sender.id, account_receiver.id]:
        raise HTTPException(
            status_code=400,
            detail="Permission denied: You are not the sender or the receiver of this transaction",
        )

    return {
        "id": transaction.id,
        "amount": transaction.amount,
        "id_account_sender": transaction.id_account_sender,
        "id_account_receiver": transaction.id_account_receiver,
        "state": transaction.state,
        "date": transaction.date,
        "label": transaction.label,
    }


@router.get("/pending-transactions")
def get_pending_transactions(
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    try:
        pending_transactions = (
            db.query(TransactionPending)
            .join(Account, TransactionPending.id_account_sender == Account.id)
            .filter(Account.user_id == current_user.id)
            .all()
        )

        return [
            {
                "id": transaction.id,
                "amount": transaction.amount,
                "id_account_sender": transaction.id_account_sender,
                "id_account_receiver": transaction.id_account_receiver,
                "date": transaction.date,
                "label": transaction.label,
            }
            for transaction in pending_transactions
        ]
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(error)}"
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500, detail=f"Unexpected error: {str(error)}"
        ) from error


@router.post("/make-transaction-auto")
def make_transaction_auto(
    transaction: TransactionAutoCreateSchema,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    try:
        # Fetch sender and receiver accounts
        sender_account = (
            db.query(Account)
            .filter(Account.id == transaction.sender_account_id)
            .first()
        )
        receiver_account = (
            db.query(Account)
            .filter(Account.id == transaction.receiver_account_id)
            .first()
        )

        # Validate accounts
        if not sender_account:
            raise HTTPException(status_code=404, detail="Sender account not found")
        if not receiver_account:
            raise HTTPException(status_code=404, detail="Receiver account not found")

        if sender_account.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not authorised to perform this action.",
            )

        # Ensure both accounts are active
        if not sender_account.state or not receiver_account.state:
            raise HTTPException(
                status_code=400, detail="One or both accounts are inactive"
            )

        # Ensure sender and receiver are different
        if transaction.sender_account_id == transaction.receiver_account_id:
            raise HTTPException(
                status_code=400, detail="Sender and receiver accounts must be different"
            )

        # Ensure the transaction amount is positive
        if transaction.amount <= 0:
            raise HTTPException(
                status_code=400, detail="Transaction amount must be greater than 0"
            )

        # Validate frequency (e.g., daily, weekly, monthly)
        if transaction.frequency.value not in [e.value for e in FrequencyEnum]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid frequency. Allowed values are: {', '.join([e.value for e in FrequencyEnum])}.",
            )

        # Ensure the start day is in the future
        if transaction.start_day <= get_current_utc_time().date():
            raise HTTPException(
                status_code=400, detail="Start day must be a future date."
            )

        # Create the automatic transaction
        new_transaction_auto = TransactionAuto(
            sender_account_id=transaction.sender_account_id,
            receiver_account_id=transaction.receiver_account_id,
            amount=transaction.amount,
            frequency=transaction.frequency,
            start_day=transaction.start_day,
            last_updated=get_current_utc_time(),
        )

        db.add(new_transaction_auto)
        db.commit()
        db.refresh(new_transaction_auto)

        return {
            "status": "success",
            "message": "Automatic transaction created successfully.",
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
