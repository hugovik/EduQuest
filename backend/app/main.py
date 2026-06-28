from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json

app = FastAPI(title="EduQuest Core API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "seed.json"

def load_data():
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))

@app.get("/health")
def health():
    return {"status": "ok", "message": "Welcome home, Lena"}

@app.get("/child")
def get_child():
    return load_data()["child"]

@app.get("/quests")
def get_quests():
    return load_data()["quests"]

@app.post("/quests/{quest_id}/complete")
def complete_quest(quest_id: str):
    data = load_data()
    quest = next((q for q in data["quests"] if q["id"] == quest_id), None)
    if not quest:
        return {"ok": False, "error": "Quest not found"}
    return {
        "ok": True,
        "questId": quest_id,
        "xpAwarded": quest["xpReward"],
        "treeGrowth": "A new leaf appeared on the Tree of Growth.",
        "certificateUnlocked": True
    }
