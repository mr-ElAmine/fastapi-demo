from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./database.db"

Base = declarative_base()

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_database():
    database_session = SessionLocal()
    try:
        yield database_session
    finally:
        database_session.close()


def save(database: Session, obj):
    database.add(obj)
    database.commit()
    database.refresh(obj)
    return obj
