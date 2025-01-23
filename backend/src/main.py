import threading

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.main_database import Base, engine
from entity.account_entity import Account
from entity.beneficiary_entity import Beneficiary
from entity.deposit_entity import Deposit
from entity.transaction_entity import Transaction, TransactionPending
from entity.user_entity import User
from src.entrypoints import (
    account_entrypoints,
    auth_entrypoints,
    beneficiary_entrypoints,
    deposit_entrypoints,
    transaction_entrypoints,
    user_entrypoints,
)
from loop.main_loop import infinite_loop

app = FastAPI()
Base.metadata.create_all(bind=engine)
models = [Account, Transaction, User, Deposit, TransactionPending, Beneficiary]

app.include_router(auth_entrypoints.router, prefix="/api", tags=["Auth"])
app.include_router(account_entrypoints.router, prefix="/api", tags=["Account"])
app.include_router(deposit_entrypoints.router, prefix="/api", tags=["Deposit"])
app.include_router(user_entrypoints.router, prefix="/api", tags=["User"])
app.include_router(transaction_entrypoints.router, prefix="/api", tags=["Transaction"])
app.include_router(beneficiary_entrypoints.router, prefix="/api", tags=["Beneficiary"])

origins = [
    "http://localhost:5173",  # Origine autorisée pour votre frontend
    "http://127.0.0.1:5173",  # Ajoutez d'autres origines si nécessaire
]

# Ajoutez le middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Autoriser ces origines
    allow_credentials=True,  # Autoriser les cookies et les identifiants
    allow_methods=["*"],  # Autoriser toutes les méthodes HTTP
    allow_headers=["*"],  # Autoriser tous les en-têtes
)


@app.on_event("startup")
async def start_loop():
    thread = threading.Thread(target=infinite_loop, daemon=True)
    thread.start()
