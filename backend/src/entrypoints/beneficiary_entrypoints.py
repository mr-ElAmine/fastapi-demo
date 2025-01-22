from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database.main_database import get_database
from entity.account_entity import Account
from entity.beneficiary_entity import Beneficiary
from entity.user_entity import User
from schema.beneficiary_schema import BeneficiaryCreateSchema
from utile import get_current_user

router = APIRouter()


@router.post("/add-beneficiaries")
def create_beneficiary(
    beneficiary: BeneficiaryCreateSchema,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):

    account = (
        db.query(Account)
        .filter(Account.id == beneficiary.beneficiary_account_id)
        .first()
    )
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found.",
        )

    if not account.state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The account is closed. Cannot add a beneficiary to a closed account.",
        )

    if account.user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot add your own account as a beneficiary.",
        )

    new_beneficiary = Beneficiary(
        added_by_user_id=current_user.id,
        beneficiary_account_id=beneficiary.beneficiary_account_id,
        name=beneficiary.name,
    )
    try:
        db.add(new_beneficiary)
        db.commit()
        db.refresh(new_beneficiary)
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Beneficiary creation failed. Please check the details.",
        ) from error
    return new_beneficiary


@router.get("/beneficiaries")
def get_beneficiaries(
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    beneficiaries = (
        db.query(Beneficiary)
        .join(Account, Account.id == Beneficiary.beneficiary_account_id)
        .filter(
            Beneficiary.added_by_user_id == current_user.id,
        )
        .all()
    )

    return beneficiaries or []
