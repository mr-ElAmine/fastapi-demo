from datetime import datetime, timedelta, timezone
import random

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from stdnum import iban

from database.main_database import get_database
from entity.user_entity import User

SECRET_KEY = "d2c4f8d9e4e7b6e6c9a2f8d9e4e7b6e6c9a2f8d9e4e7b6e6c9a2f8d9e4e7b6e6"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10_000

oauth2_scheme = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError as error:
        raise ValueError("Token expired") from error
    except jwt.InvalidTokenError as error:
        raise ValueError("Invalid token") from error


def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
    db: Session = Depends(get_database),
):
    try:
        payload = decode_access_token(token.credentials)
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token.")
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found.")
        return user
    except jwt.PyJWTError as error:
        raise HTTPException(status_code=401, detail="Invalid token.") from error


def get_current_utc_time():
    return datetime.now(timezone.utc)


def generate_iban(country_code: str = "FR") -> str:

    # Longueurs des IBAN pour différents pays
    iban_lengths = {
        "FR": 27,  # France
        "DE": 22,  # Allemagne
        "ES": 24,  # Espagne
        "IT": 27,  # Italie
    }

    if country_code not in iban_lengths:
        raise ValueError(f"Le pays {country_code} n'est pas supporté.")

    # Génération aléatoire des parties de l'IBAN
    bank_code = "".join(random.choices("0123456789", k=5))  # Code banque (5 chiffres)
    account_number = "".join(
        random.choices("0123456789", k=11)
    )  # Numéro de compte (11 chiffres)

    # Créer la base sans les chiffres de contrôle
    basic_account_number = f"{bank_code}{account_number}".ljust(
        iban_lengths[country_code] - 4, "0"
    )

    # Ajouter le code pays et les chiffres de contrôle temporaires (00)
    temporary_iban = f"{country_code}00{basic_account_number}"

    # Calcul des chiffres de contrôle
    valid_check_digits = iban.calc_check_digits(temporary_iban)

    return f"{country_code}{valid_check_digits}{basic_account_number}"
