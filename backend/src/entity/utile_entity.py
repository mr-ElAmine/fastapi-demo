import enum


# pylint: disable=too-few-public-methods
class State(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    REDIRECT = "redirect"
    CLOSE = "close"


# pylint: disable=too-few-public-methods
class AccountType(enum.Enum):
    SAVINGS = "savings"  # Épargne
    CHECKING = "checking"  # Courant
    BUSINESS = "business"  # Entreprise
    JOINT = "joint"  # Commun
    SALARY = "salary"  # Salaire
    INVESTMENT = "investment"  # Investissement
    RETIREMENT = "retirement"  # Retraite
    YOUTH = "youth"  # Jeune
    PREMIUM = "premium"  # Premium
    PEL = "home savings plan"  # Plan Épargne Logement
    CEL = "housing savings account"  # Compte Épargne Logement
    LIVRET_A = "livret A"  # Livret A
    YOUTH_SAVINGS = "youth savings"  # Livret Jeune
