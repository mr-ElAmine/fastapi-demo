from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database.main import get_database
from entity.account import Account
from entity.deposit import Deposit
from schema.deposit import DepositCreateSchema

router = APIRouter()


@router.post("/deposit")
def deposit(deposit_data: DepositCreateSchema, db: Session = Depends(get_database)):
    if deposit_data.amount <= 0:
        raise HTTPException(
            status_code=400, detail="The deposit amount must be greater than zero."
        )

    account = db.query(Account).filter_by(id=deposit_data.account_id).first()
    if not account:
        raise HTTPException(
            status_code=404, detail="The specified account does not exist."
        )

    try:
        account.balance += deposit_data.amount
        db.add(account)

        deposit_record = Deposit(account_id=account.id, amount=deposit_data.amount)
        db.add(deposit_record)

        db.commit()

        return {
            "status": "success",
            "message": "Deposit completed successfully.",
        }
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the deposit."
        ) from error
