from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database.main import get_database
from entity.account_entity import Account
from entity.deposit_entity import Deposit
from entity.user_entity import User
from schema.deposit_schema import DepositCreateSchema
from utile import get_current_user, get_current_utc_time

router = APIRouter()


@router.post("/deposit")
def deposit(
    deposit_data: DepositCreateSchema,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    if deposit_data.amount <= 0:
        raise HTTPException(
            status_code=400, detail="The deposit amount must be greater than zero."
        )

    account = db.query(Account).filter_by(id=deposit_data.account_id).first()
    if not account:
        raise HTTPException(
            status_code=404, detail="The specified account does not exist."
        )

    if account.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorised.",
        )

    try:
        current_time = get_current_utc_time()

        account.balance += deposit_data.amount
        db.add(account)

        deposit_record = Deposit(
            account_id=account.id, amount=deposit_data.amount, date=current_time
        )
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
