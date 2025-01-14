from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import exc
from entity.user import User
from schema.user import UserSchema
from database.main import get_database

router = APIRouter()

@router.get("/user-detail", response_model=list[UserSchema])
def get_users(db: Session = Depends(get_database)):
    try:
        users = db.query(User).all()
        return users
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred")
