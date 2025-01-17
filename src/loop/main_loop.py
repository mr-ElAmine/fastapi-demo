from datetime import timedelta, timezone
import time

from sqlalchemy.exc import SQLAlchemyError

from database.main_database import get_database
from entity.account_entity import Account
from entity.transaction_entity import Transaction, TransactionPending
from entity.utile_entity import State
from utile import get_current_utc_time

CANCELLATION_TIMEOUT_SECONDS = 30
BALANCE_THRESHOLD = 50_000


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
                    date=transaction_date,
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


def redistribute_surplus():
    try:
        with next(get_database()) as db:
            # Fetch all accounts
            all_accounts = db.query(Account).all()

            for account in all_accounts:
                # Find the main account for the user
                main_account = (
                    db.query(Account)
                    .filter(
                        Account.user_id == account.user_id,
                        Account.is_main == True,
                    )
                    .first()
                )

                # Skip if no main account is found or if the account is already the main account
                if not main_account or account.is_main:
                    continue

                # Check if the account exceeds the balance threshold
                if account.balance > BALANCE_THRESHOLD:
                    surplus = account.balance - BALANCE_THRESHOLD
                    account.balance = (
                        BALANCE_THRESHOLD  # Reset account balance to the threshold
                    )
                    main_account.balance += (
                        surplus  # Transfer surplus to the main account
                    )

                    # Log the transaction (optional)
                    print(
                        f"Transferred surplus of {surplus} from account {account.id} to main account {main_account.id}."
                    )

                    # Record the transaction
                    confirmed_transaction = Transaction(
                        amount=surplus,
                        id_account_sender=account.id,
                        id_account_receiver=main_account.id,
                        state=State.REDIRECT,
                        date=get_current_utc_time(),
                    )
                    db.add(confirmed_transaction)

            # Commit the changes after processing all accounts
            db.commit()

    except SQLAlchemyError as error:
        print(f"Database error: {error}")
        if "db" in locals():
            db.rollback()


def infinite_loop():
    while True:
        process_pending_transactions()
        redistribute_surplus()
        time.sleep(5)
