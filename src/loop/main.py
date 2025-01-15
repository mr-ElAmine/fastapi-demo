from datetime import timedelta, timezone
import time

from sqlalchemy.exc import SQLAlchemyError

from database.main import get_database
from entity.account import Account
from entity.transaction import Transaction, TransactionPending
from entity.utile import State
from utile import get_current_utc_time

CANCELLATION_TIMEOUT_SECONDS = 600


def process_pending_transactions():
    try:
        # Start a database session
        with next(get_database()) as db:
            # Get the current time
            current_time = get_current_utc_time()

            # Fetch expired transactions
            expired_transactions = db.query(TransactionPending).all()

            for transaction_pending in expired_transactions:
                transaction_date = transaction_pending.date.replace(tzinfo=timezone.utc)
                if current_time < transaction_date + timedelta(
                    seconds=CANCELLATION_TIMEOUT_SECONDS
                ):
                    continue

                receiver_account = (
                    db.query(Account)
                    .filter(Account.id == transaction_pending.id_account_receiver)
                    .first()
                )

                # Update balances and confirm transaction
                receiver_account.balance += transaction_pending.amount
                confirmed_transaction = Transaction(
                    amount=transaction_pending.amount,
                    id_account_sender=transaction_pending.id_account_sender,
                    id_account_receiver=transaction_pending.id_account_receiver,
                    state=State.CONFIRMED,
                    date=transaction_date
                )
                db.add(confirmed_transaction)

                # Remove the pending transaction
                db.delete(transaction_pending)

                print(
                    f"{transaction_pending.id} transactions confirmed automatically at {current_time}."
                )

            # Commit changes
            db.commit()

    except SQLAlchemyError as error:
        print(f"Database error: {error}")
        if "db" in locals():
            db.rollback()


def infinite_loop():
    while True:
        process_pending_transactions()
        time.sleep(CANCELLATION_TIMEOUT_SECONDS // 2)
