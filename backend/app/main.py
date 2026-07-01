from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.api.child_routes import router as child_router
from app.api.inventory_routes import router as inventory_router
from app.api.learning_routes import router as learning_router
from app.api.quest_routes import router as quest_router
from app.database.database import Base, engine
from app.api.dev_routes import router as dev_router

Base.metadata.create_all(bind=engine)


def ensure_column(inspector, table_name: str, column_name: str, definition: str):
    if table_name not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns(table_name)}

    if column_name not in columns:
        with engine.begin() as connection:
            connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {definition}"))


def ensure_dev_schema():
    inspector = inspect(engine)

    ensure_column(
        inspector,
        "quests",
        "repeatable",
        "repeatable BOOLEAN NOT NULL DEFAULT 0",
    )
    ensure_column(
        inspector,
        "progress_events",
        "quest_completion_id",
        "quest_completion_id INTEGER",
    )
    ensure_column(
        inspector,
        "tree_growth_events",
        "quest_completion_id",
        "quest_completion_id INTEGER",
    )


ensure_dev_schema()

app = FastAPI(title="EduQuest Core API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "message": "Welcome home, Lena"}


app.include_router(child_router)
app.include_router(quest_router)
app.include_router(inventory_router)
app.include_router(learning_router)
app.include_router(dev_router)