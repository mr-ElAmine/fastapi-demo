from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database.main import get_database, save
from entity.account import Account
from entity.user import User
from schema.account import AccountCreateSchema

router = APIRouter()


@router.post("/create-account")
def create_account(
    account_data: AccountCreateSchema, database_session: Session = Depends(get_database)
):
    user = database_session.query(User).filter(User.id == account_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist.")

    try:
        new_account = Account(
            user_id=account_data.user_id,
            balance=0,
            state=True,
            is_main=False,
        )
        save(database_session, new_account)

        return {
            "status": "success",
            "message": "Account successfully created",
        }
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=500, detail="An error occurred while creating the account."
        ) from error


@router.get("/account/{account_id}")
def get_account(account_id: int, database_session: Session = Depends(get_database)):

    account = database_session.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account does not exist.")

    return {
        "id": account.id,
        "balance": account.balance,
        "state": account.state,
        "is_main": account.is_main,
        "created_at": account.date,
    }
