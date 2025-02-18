from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database.main_database import get_database, save
from entity.account_entity import Account
from entity.beneficiary_entity import Beneficiary
from entity.transaction_entity import Transaction, TransactionPending
from entity.user_entity import User
from entity.utile_entity import AccountType, State
from schema.account_schema import CloseAccountSchema, CreateAccountSchema
from utile import generate_iban, get_current_user, get_current_utc_time, verify_password

router = APIRouter()


@router.post("/create-account")
def create_account(
    new_account_data: CreateAccountSchema,
    database_session: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    user = database_session.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist.")

    if user.id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorised.",
        )

    if new_account_data.type == AccountType.CHECKING:
        raise HTTPException(
            status_code=403,
            detail="You are not authorised to create this account type.",
        )

    try:
        current_time = datetime.now(timezone.utc)
        new_account = Account(
            id=generate_iban(),
            user_id=current_user.id,
            name=new_account_data.name,
            balance=0,
            is_main=False,
            type=new_account_data.type,
            date=current_time,
        )
        new_beneficiary = Beneficiary(
            added_by_user_id=current_user.id,
            beneficiary_account_id=new_account.id,
            name=new_account_data.name,
        )
        save(database_session, new_account)
        save(database_session, new_beneficiary)

        return {
            "status": "success",
            "message": "Account successfully created",
        }
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=500, detail="An error occurred while creating the account."
        ) from error


@router.get("/account/{account_id}")
def get_account(
    account_id: str,
    database_session: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):

    account = (
        database_session.query(Account)
        .filter(Account.id == account_id, Account.state == True)
        .first()
    )
    if not account:
        raise HTTPException(status_code=404, detail="Account does not exist.")

    if account.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorised.",
        )
    return {
        "id": account.id,
        "balance": account.balance,
        "state": account.state,
        "is_main": account.is_main,
        "created_at": account.date,
        "type": account.type,
    }


@router.get("/accounts")
def get_accounts(
    database_session: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    accounts = (
        database_session.query(Account)
        .filter(Account.user_id == current_user.id, Account.state == True)
        .order_by(desc(Account.date))
        .all()
    )

    return [
        {
            "id": account.id,
            "uuid": account.uuid,
            "balance": account.balance,
            "state": account.state,
            "is_main": account.is_main,
            "created_at": account.date,
            "type": account.type,
            "name": account.name,
        }
        for account in accounts
    ]


@router.post("/close-account/{account_id}")
def close_account(
    data_account: CloseAccountSchema,
    database_session: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    # Retrieve the account by ID
    account = database_session.query(Account).filter(Account.id == data_account.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account does not exist.")

    # Check if the current user is authorised to close the account
    if account.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorised to close this account.",
        )
    
    user = database_session.query(User).filter(User.id == current_user.id).first()

    if not verify_password(data_account.password, user.password):
        raise HTTPException(status_code=400, detail="password is incorrect.")

    # Ensure the account is not already closed
    if not account.state:
        raise HTTPException(
            status_code=400,
            detail="Account is already closed.",
        )

    # Prevent closing the main account
    if account.is_main:
        raise HTTPException(
            status_code=400,
            detail="Main accounts cannot be closed.",
        )

    is_involved = (
        database_session.query(TransactionPending)
        .filter(
            (TransactionPending.id_account_sender == data_account.account_id)
            | (TransactionPending.id_account_receiver == data_account.account_id)
        )
        .first()
        is not None
    )

    if is_involved:
        raise HTTPException(
            status_code=400,
            detail="Account is involved in pending transactions and cannot be closed.",
        )

    try:
        # Retrieve the main account for the user
        main_account = (
            database_session.query(Account)
            .filter(
                Account.user_id == account.user_id,
                Account.is_main == True,
            )
            .first()
        )
        if not main_account:
            raise HTTPException(
                status_code=404,
                detail="Main account for the user does not exist. Cannot transfer the balance.",
            )

        # Create a transaction for the balance transfer
        confirmed_transaction = Transaction(
            amount=account.balance,
            id_account_sender=account.id,
            id_account_receiver=main_account.id,
            state=State.CLOSE,
            date=get_current_utc_time(),
        )
        database_session.add(confirmed_transaction)

        # Transfer the balance to the main account
        main_account.balance += account.balance
        account.balance = 0  # Reset the balance of the closed account

        # Mark the account as closed
        account.state = False

        # Save the changes
        save(database_session, account)
        save(database_session, main_account)

        return {
            "status": "success",
            "message": (f"Account {data_account.account_id} successfully closed."),
        }

    except SQLAlchemyError as error:
        database_session.rollback()  # Rollback changes on error
        raise HTTPException(
            status_code=500, detail="An error occurred while closing the account."
        ) from error
