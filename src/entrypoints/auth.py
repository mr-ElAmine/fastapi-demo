from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.main import get_database, save
from entity.user import User
from schema.user import LoginSchema, UserSchema
from utile import create_access_token, hash_password, verify_password

router = APIRouter()


@router.post("/login")
def login_user(user_data: LoginSchema, db: Session = Depends(get_database)):

    user = db.query(User).filter(User.email == user_data.email).first()
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

    save(database_session, new_user)

    return {"status": "success", "message": "User created successfully"}
