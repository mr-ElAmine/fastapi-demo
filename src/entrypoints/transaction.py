from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from datetime import datetime

from database.main import get_database
from entity.account import Account
from entity.transaction import Transaction
from entity.user import User
from schema.transaction import TransactionSchema
from schema.account import AccountSchema
from utile import get_current_user

router = APIRouter()


@router.post("/make-transaction")
def make_transaction(
    transaction: TransactionSchema, db: Session = Depends(get_database)
):
    try:
        # Fetch sender and receiver accounts from the database
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

        # Check if both accounts exist
        if not sender_account:
            raise HTTPException(status_code=404, detail="Sender account not found")
        if not receiver_account:
            raise HTTPException(status_code=404, detail="Receiver account not found")

        # Check if sender account has sufficient balance
        if sender_account.balance < transaction.amount:
            raise HTTPException(
                status_code=400, detail="Insufficient balance in sender's account"
            )

        # Check if both accounts are active
        if not sender_account.state or not receiver_account.state:
            raise HTTPException(
                status_code=400, detail="One or both accounts are inactive"
            )

        # Check if the both account are not the same
        if transaction.id_account_sender == transaction.id_account_receiver:
            raise HTTPException(
                status_code=400, detail="Both account need to be different"
            )

        # Check if the transaction amount isn't negative
        if transaction.amount < 0:
            raise HTTPException(status_code=400, detail="Amount need to be > 0")

        # Perform the transaction
        sender_account.balance -= transaction.amount
        receiver_account.balance += transaction.amount

        # Create the transaction record
        new_transaction = Transaction(
            amount=transaction.amount,
            state=True,  # Assuming transaction is successful
            id_account_sender=transaction.id_account_sender,
            id_account_receiver=transaction.id_account_receiver,
            date=datetime.utcnow(),
        )
        db.add(new_transaction)

        # Commit changes to the database
        db.commit()
        db.refresh(new_transaction)

        return new_transaction

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/transactions/{account_id}")
def get_transactions(
   account_id: int, db: Session = Depends(get_database)
):
    transaction = db.query(Transaction).filter(Transaction.id_account_receiver == account_id).first()
    if transaction is None:
        raise HTTPException(status_code=404, detail="transaction not found")
    return {
        "amount": transaction.amount,
        "sender": transaction.id_account_sender,
        "receiver": transaction.id_account_receiver,
        "state": transaction.state,
        "date": transaction.date
    }
