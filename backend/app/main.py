from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.child_routes import router as child_router
from app.api.quest_routes import router as quest_router
from app.database.database import Base, engine

Base.metadata.create_all(bind=engine)

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