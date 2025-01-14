from fastapi import FastAPI

from database.main import Base, engine
from entity.account import Account
from entity.transaction import Transaction
from entity.user import User
from entrypoints import account, auth, deposit

app = FastAPI()
Base.metadata.create_all(bind=engine)
models = [Account, Transaction, User]

app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(account.router, prefix="/api", tags=["Account"])
app.include_router(deposit.router, prefix="/api", tags=["Deposit"])


@app.get("/api")
def index():
    return {"status": "success", "message": "Hello Werd"}
