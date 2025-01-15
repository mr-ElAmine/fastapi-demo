import threading

from fastapi import FastAPI

from database.main import Base, engine
from entity.account import Account
from entity.deposit import Deposit
from entity.transaction import Transaction, TransactionPending
from entity.user import User
from entrypoints import account, auth, deposit, transaction, user
from loop.main import infinite_loop

app = FastAPI()
Base.metadata.create_all(bind=engine)
models = [Account, Transaction, User, Deposit, TransactionPending]

app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(account.router, prefix="/api", tags=["Account"])
app.include_router(deposit.router, prefix="/api", tags=["Deposit"])
app.include_router(user.router, prefix="/api", tags=["User"])
app.include_router(transaction.router, prefix="/api", tags=["Transaction"])


@app.on_event("startup")
async def start_loop():
    thread = threading.Thread(target=infinite_loop, daemon=True)
    thread.start()
