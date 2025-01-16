from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import exc
from sqlalchemy.orm import Session

from database.main_database import get_database
from entity.user_entity import User
from utile import get_current_user

router = APIRouter()


@router.get("/user-details")
def get_user_by_id(
    db: Session = Depends(get_database), current_user: User = Depends(get_current_user)
):
    try:
        user = db.query(User).filter(User.id == current_user.id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }
    except exc.SQLAlchemyError as error:
        raise HTTPException(
            status_code=500, detail="Database error occurred"
        ) from error
