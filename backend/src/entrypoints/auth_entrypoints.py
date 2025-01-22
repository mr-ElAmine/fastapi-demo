from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.main_database import get_database
from entity.account_entity import Account
from entity.deposit_entity import Deposit
from entity.user_entity import User
from schema.user import LoginSchema, UserSchema
from utile import create_access_token, generate_iban, hash_password, verify_password

router = APIRouter()


@router.post("/login")
def login_user(
    user_data: LoginSchema, database_session: Session = Depends(get_database)
):

    user = database_session.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Invalid email or password")

    if not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.email})

    return {
        "status": "success",
        "message": "User logged in successfully",
        "token": access_token,
    }


@router.post("/register")
def register_user(
    user_data: UserSchema, database_session: Session = Depends(get_database)
):
    existing_user = (
        database_session.query(User).filter(User.email == user_data.email).first()
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        password=hash_password(user_data.password),
    )
    database_session.add(new_user)
    database_session.flush()

    current_time = datetime.now(timezone.utc)

    new_account = Account(
        id=generate_iban(),
        user_id=new_user.id,
        balance=0,
        state=True,
        is_main=True,
        date=current_time,
    )
    database_session.add(new_account)
    database_session.flush()

    new_account.balance = 100
    database_session.add(new_account)

    deposit_record = Deposit(
        account_id=new_account.id,
        amount=100,
        date=current_time,
    )
    database_session.add(deposit_record)

    database_session.commit()

    return {"status": "success", "message": "User created successfully"}
