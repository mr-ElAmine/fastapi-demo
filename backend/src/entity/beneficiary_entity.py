<<<<<<< HEAD
from sqlalchemy import Column, Integer, String
=======
from sqlalchemy import Column, ForeignKey, Integer, String
>>>>>>> 91beef0d4d3953d602c129d65a78869de23d7723
from sqlalchemy.orm import relationship

from database.main_database import Base


# pylint: disable=too-few-public-methods
class Beneficiary(Base):
    __tablename__ = "beneficiaries"

<<<<<<< HEAD
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)

    # Relation avec la table Account
    accounts = relationship("Account", back_populates="user")
=======
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    added_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    beneficiary_account_id = Column(
        String(34), ForeignKey("accounts.id"), nullable=False
    )
    name = Column(String(255), nullable=False)

    # Relationships
    added_by_user = relationship(
            "User", back_populates="added_beneficiaries"
        )
    beneficiary_account = relationship(
            "Account", back_populates="beneficiaries"
        )
>>>>>>> 91beef0d4d3953d602c129d65a78869de23d7723
