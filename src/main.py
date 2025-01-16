import threading

from fastapi import FastAPI

from database.main import Base, engine
from entity.account_entity import Account
from entity.deposit_entity import Deposit
from entity.transaction_entity import Transaction, TransactionPending
from entity.user_entity import User
from entrypoints import (
    account_entrypoints,
    auth_entrypoints,
    deposit_entrypoints,
    transaction_entrypoints,
    user_entrypoints,
)
from loop.main import infinite_loop

app = FastAPI()
Base.metadata.create_all(bind=engine)
models = [Account, Transaction, User, Deposit, TransactionPending]

app.include_router(auth_entrypoints.router, prefix="/api", tags=["Auth"])
app.include_router(account_entrypoints.router, prefix="/api", tags=["Account"])
app.include_router(deposit_entrypoints.router, prefix="/api", tags=["Deposit"])
app.include_router(user_entrypoints.router, prefix="/api", tags=["User"])
app.include_router(transaction_entrypoints.router, prefix="/api", tags=["Transaction"])


@app.on_event("startup")
async def start_loop():
    thread = threading.Thread(target=infinite_loop, daemon=True)
    thread.start()
