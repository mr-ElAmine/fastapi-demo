from datetime import datetime, timedelta, timezone
import time

from sqlalchemy.exc import SQLAlchemyError

from database.main import get_database
from entity.account import Account
from entity.transaction import Transaction, TransactionPending
from entity.utile import State

CANCELLATION_TIMEOUT_SECONDS = 600


def infinite_loop():
    while True:
        try:
            # Démarrer une session de base de données
            with next(get_database()) as db:  # Utilisation du contexte pour la session
                # Récupérer l'heure actuelle
                current_time = datetime.now(timezone.utc)

                # Récupérer les transactions en attente dépassant le délai d'annulation
                expired_transactions = (
                    db.query(TransactionPending)
                    .filter(
                        TransactionPending.date
                        + timedelta(seconds=CANCELLATION_TIMEOUT_SECONDS)
                        < current_time
                    )
                    .all()
                )

                # Traiter chaque transaction expirée
                for transaction_pending in expired_transactions:
                    # Récupérer les comptes expéditeur et destinataire
                    sender_account = (
                        db.query(Account)
                        .filter(Account.id == transaction_pending.id_account_sender)
                        .first()
                    )
                    receiver_account = (
                        db.query(Account)
                        .filter(Account.id == transaction_pending.id_account_receiver)
                        .first()
                    )

                    if not sender_account or not receiver_account:
                        print(
                            f"Impossible de traiter la transaction {transaction_pending.id}: comptes introuvables."
                        )
                        continue

                    # Mettre à jour les soldes
                    receiver_account.balance += transaction_pending.amount

                    # Ajouter la transaction confirmée
                    confirmed_transaction = Transaction(
                        amount=transaction_pending.amount,
                        id_account_sender=transaction_pending.id_account_sender,
                        id_account_receiver=transaction_pending.id_account_receiver,
                        state=State.CONFIRMED,
                        date=current_time,
                    )
                    db.add(confirmed_transaction)

                    # Supprimer la transaction en attente
                    db.delete(transaction_pending)

                # Valider les changements dans la base de données
                db.commit()

                # Afficher le résultat pour le suivi
                print(
                    f"{len(expired_transactions)} transactions confirmées automatiquement à {current_time}."
                )

        except SQLAlchemyError as error:
            print(f"Erreur liée à la base de données : {error}")
            db.rollback()
        except ValueError as error:
            print(f"Erreur de type ou de valeur inattendue : {error}")
        except KeyError as error:
            print(f"Erreur de clé inattendue : {error}")

        time.sleep(CANCELLATION_TIMEOUT_SECONDS - (CANCELLATION_TIMEOUT_SECONDS / 2))
