from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database.main_database import Base


# pylint: disable=too-few-public-methods
class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    added_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    beneficiary_account_id = Column(
        String(34), ForeignKey("accounts.id"), nullable=False
    )
    name = Column(String(255), nullable=False)

    # Relationships
    added_by_user = relationship("User", back_populates="added_beneficiaries")
    beneficiary_account = relationship("Account", back_populates="beneficiaries")