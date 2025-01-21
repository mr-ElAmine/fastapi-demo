import enum


# pylint: disable=too-few-public-methods
class State(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    REDIRECT = "redirect"
    CLOSE = "close"
