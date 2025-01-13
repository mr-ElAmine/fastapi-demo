from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/")
def index():
    return {"Hello": "World"}
