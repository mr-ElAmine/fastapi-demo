from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from database.main_database import Base


# pylint: disable=too-few-public-methods
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)

    # Relation avec la table Account
    accounts = relationship("Account", back_populates="user")
    added_beneficiaries = relationship(
        "Beneficiary",
        back_populates="added_by_user",
        cascade="all, delete-orphan"
    )