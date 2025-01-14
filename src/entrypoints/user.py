from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import exc
from entity.user import User
from database.main import get_database

router = APIRouter()

@router.get("/user-details/{user_id}")
def get_user_by_id(user_id: int, db: Session = Depends(get_database)):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email
        }
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred")
