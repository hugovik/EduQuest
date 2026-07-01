import json
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.child import Child
from app.models.reading_passage import ReadingPassage
from app.models.reading_progress import ReadingProgress
from app.repositories.child_repository import ChildRepository
from app.repositories.reading_repository import (
    ReadingPassageRepository,
    ReadingProgressRepository,
)
from app.services.achievement_service import AchievementService
from app.services.daily_goal_service import DailyGoalService
from app.services.progression_rules import (
    calculate_level_from_xp,
    calculate_tree_stage_from_xp,
)

READING_CORRECT_ANSWER_XP = 5
READING_PASSAGES = [
    {
        "id": "reading-l1-01",
        "title": "Pine Path Story",
        "level": 1,
        "text": "Lena walks on the pine path. A rabbit sees a shiny leaf. Lena reads a small sign. The sign says the safe path is beside the old tree. Lena smiles and follows the trail.",
        "estimated_reading_time": "1 min",
        "vocabulary_words": [
            "trail",
            "leaf"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A rabbit appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "trail",
                    "spaceship",
                    "piano"
                ],
                "answer": "trail"
            }
        ]
    },
    {
        "id": "reading-l1-02",
        "title": "Mossy Log Story",
        "level": 1,
        "text": "Lena walks on the mossy log. A squirrel sees a shiny leaf. Lena reads a small sign. The sign says the safe path is beside the old tree. Lena smiles and follows the trail.",
        "estimated_reading_time": "1 min",
        "vocabulary_words": [
            "trail",
            "leaf"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A squirrel appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "trail",
                    "spaceship",
                    "piano"
                ],
                "answer": "trail"
            }
        ]
    },
    {
        "id": "reading-l1-03",
        "title": "Little Stream Story",
        "level": 1,
        "text": "Lena walks on the little stream. A owl sees a shiny leaf. Lena reads a small sign. The sign says the safe path is beside the old tree. Lena smiles and follows the trail.",
        "estimated_reading_time": "1 min",
        "vocabulary_words": [
            "trail",
            "leaf"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A owl appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "trail",
                    "spaceship",
                    "piano"
                ],
                "answer": "trail"
            }
        ]
    },
    {
        "id": "reading-l1-04",
        "title": "Fox Trail Story",
        "level": 1,
        "text": "Lena walks on the fox trail. A fox sees a shiny leaf. Lena reads a small sign. The sign says the safe path is beside the old tree. Lena smiles and follows the trail.",
        "estimated_reading_time": "1 min",
        "vocabulary_words": [
            "trail",
            "leaf"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A fox appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "trail",
                    "spaceship",
                    "piano"
                ],
                "answer": "trail"
            }
        ]
    },
    {
        "id": "reading-l1-05",
        "title": "Sunny Fern Story",
        "level": 1,
        "text": "Lena walks on the sunny fern. A deer sees a shiny leaf. Lena reads a small sign. The sign says the safe path is beside the old tree. Lena smiles and follows the trail.",
        "estimated_reading_time": "1 min",
        "vocabulary_words": [
            "trail",
            "leaf"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A deer appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "trail",
                    "spaceship",
                    "piano"
                ],
                "answer": "trail"
            }
        ]
    },
    {
        "id": "reading-l1-06",
        "title": "Acorn Map Story",
        "level": 1,
        "text": "Lena walks on the acorn map. A rabbit sees a shiny leaf. Lena reads a small sign. The sign says the safe path is beside the old tree. Lena smiles and follows the trail.",
        "estimated_reading_time": "1 min",
        "vocabulary_words": [
            "trail",
            "leaf"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A rabbit appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "trail",
                    "spaceship",
                    "piano"
                ],
                "answer": "trail"
            }
        ]
    },
    {
        "id": "reading-l1-07",
        "title": "Quiet Pond Story",
        "level": 1,
        "text": "Lena walks on the quiet pond. A squirrel sees a shiny leaf. Lena reads a small sign. The sign says the safe path is beside the old tree. Lena smiles and follows the trail.",
        "estimated_reading_time": "1 min",
        "vocabulary_words": [
            "trail",
            "leaf"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A squirrel appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "trail",
                    "spaceship",
                    "piano"
                ],
                "answer": "trail"
            }
        ]
    },
    {
        "id": "reading-l1-08",
        "title": "Deer Meadow Story",
        "level": 1,
        "text": "Lena walks on the deer meadow. A owl sees a shiny leaf. Lena reads a small sign. The sign says the safe path is beside the old tree. Lena smiles and follows the trail.",
        "estimated_reading_time": "1 min",
        "vocabulary_words": [
            "trail",
            "leaf"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A owl appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "trail",
                    "spaceship",
                    "piano"
                ],
                "answer": "trail"
            }
        ]
    },
    {
        "id": "reading-l1-09",
        "title": "Owl Lantern Story",
        "level": 1,
        "text": "Lena walks on the owl lantern. A fox sees a shiny leaf. Lena reads a small sign. The sign says the safe path is beside the old tree. Lena smiles and follows the trail.",
        "estimated_reading_time": "1 min",
        "vocabulary_words": [
            "trail",
            "leaf"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A fox appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "trail",
                    "spaceship",
                    "piano"
                ],
                "answer": "trail"
            }
        ]
    },
    {
        "id": "reading-l1-10",
        "title": "Berry Bridge Story",
        "level": 1,
        "text": "Lena walks on the berry bridge. A deer sees a shiny leaf. Lena reads a small sign. The sign says the safe path is beside the old tree. Lena smiles and follows the trail.",
        "estimated_reading_time": "1 min",
        "vocabulary_words": [
            "trail",
            "leaf"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A deer appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "trail",
                    "spaceship",
                    "piano"
                ],
                "answer": "trail"
            }
        ]
    },
    {
        "id": "reading-l2-01",
        "title": "Pine Path Story",
        "level": 2,
        "text": "Lena enters the pine path in Reading Forest. A rabbit carries a small note with a glimmer mark. Lena is curious and reads the note carefully. It tells her to look beside the old tree before crossing the path.",
        "estimated_reading_time": "2 min",
        "vocabulary_words": [
            "curious",
            "glimmer"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A rabbit appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "curious",
                    "spaceship",
                    "piano"
                ],
                "answer": "curious"
            }
        ]
    },
    {
        "id": "reading-l2-02",
        "title": "Mossy Log Story",
        "level": 2,
        "text": "Lena enters the mossy log in Reading Forest. A squirrel carries a small note with a glimmer mark. Lena is curious and reads the note carefully. It tells her to look beside the old tree before crossing the path.",
        "estimated_reading_time": "2 min",
        "vocabulary_words": [
            "curious",
            "glimmer"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A squirrel appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "curious",
                    "spaceship",
                    "piano"
                ],
                "answer": "curious"
            }
        ]
    },
    {
        "id": "reading-l2-03",
        "title": "Little Stream Story",
        "level": 2,
        "text": "Lena enters the little stream in Reading Forest. A owl carries a small note with a glimmer mark. Lena is curious and reads the note carefully. It tells her to look beside the old tree before crossing the path.",
        "estimated_reading_time": "2 min",
        "vocabulary_words": [
            "curious",
            "glimmer"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A owl appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "curious",
                    "spaceship",
                    "piano"
                ],
                "answer": "curious"
            }
        ]
    },
    {
        "id": "reading-l2-04",
        "title": "Fox Trail Story",
        "level": 2,
        "text": "Lena enters the fox trail in Reading Forest. A fox carries a small note with a glimmer mark. Lena is curious and reads the note carefully. It tells her to look beside the old tree before crossing the path.",
        "estimated_reading_time": "2 min",
        "vocabulary_words": [
            "curious",
            "glimmer"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A fox appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "curious",
                    "spaceship",
                    "piano"
                ],
                "answer": "curious"
            }
        ]
    },
    {
        "id": "reading-l2-05",
        "title": "Sunny Fern Story",
        "level": 2,
        "text": "Lena enters the sunny fern in Reading Forest. A deer carries a small note with a glimmer mark. Lena is curious and reads the note carefully. It tells her to look beside the old tree before crossing the path.",
        "estimated_reading_time": "2 min",
        "vocabulary_words": [
            "curious",
            "glimmer"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A deer appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "curious",
                    "spaceship",
                    "piano"
                ],
                "answer": "curious"
            }
        ]
    },
    {
        "id": "reading-l2-06",
        "title": "Acorn Map Story",
        "level": 2,
        "text": "Lena enters the acorn map in Reading Forest. A rabbit carries a small note with a glimmer mark. Lena is curious and reads the note carefully. It tells her to look beside the old tree before crossing the path.",
        "estimated_reading_time": "2 min",
        "vocabulary_words": [
            "curious",
            "glimmer"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A rabbit appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "curious",
                    "spaceship",
                    "piano"
                ],
                "answer": "curious"
            }
        ]
    },
    {
        "id": "reading-l2-07",
        "title": "Quiet Pond Story",
        "level": 2,
        "text": "Lena enters the quiet pond in Reading Forest. A squirrel carries a small note with a glimmer mark. Lena is curious and reads the note carefully. It tells her to look beside the old tree before crossing the path.",
        "estimated_reading_time": "2 min",
        "vocabulary_words": [
            "curious",
            "glimmer"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A squirrel appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "curious",
                    "spaceship",
                    "piano"
                ],
                "answer": "curious"
            }
        ]
    },
    {
        "id": "reading-l2-08",
        "title": "Deer Meadow Story",
        "level": 2,
        "text": "Lena enters the deer meadow in Reading Forest. A owl carries a small note with a glimmer mark. Lena is curious and reads the note carefully. It tells her to look beside the old tree before crossing the path.",
        "estimated_reading_time": "2 min",
        "vocabulary_words": [
            "curious",
            "glimmer"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A owl appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "curious",
                    "spaceship",
                    "piano"
                ],
                "answer": "curious"
            }
        ]
    },
    {
        "id": "reading-l2-09",
        "title": "Owl Lantern Story",
        "level": 2,
        "text": "Lena enters the owl lantern in Reading Forest. A fox carries a small note with a glimmer mark. Lena is curious and reads the note carefully. It tells her to look beside the old tree before crossing the path.",
        "estimated_reading_time": "2 min",
        "vocabulary_words": [
            "curious",
            "glimmer"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A fox appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "curious",
                    "spaceship",
                    "piano"
                ],
                "answer": "curious"
            }
        ]
    },
    {
        "id": "reading-l2-10",
        "title": "Berry Bridge Story",
        "level": 2,
        "text": "Lena enters the berry bridge in Reading Forest. A deer carries a small note with a glimmer mark. Lena is curious and reads the note carefully. It tells her to look beside the old tree before crossing the path.",
        "estimated_reading_time": "2 min",
        "vocabulary_words": [
            "curious",
            "glimmer"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A deer appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "curious",
                    "spaceship",
                    "piano"
                ],
                "answer": "curious"
            }
        ]
    },
    {
        "id": "reading-l3-01",
        "title": "Pine Path Story",
        "level": 3,
        "text": "Lena explores the pine path while the forest grows quiet around her. A rabbit pauses near a stone marker, so Lena decides to discover what the marker means. She reads the clue, compares it with the map, and chooses the path beside the old tree.",
        "estimated_reading_time": "3 min",
        "vocabulary_words": [
            "discover",
            "observe"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A rabbit appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "discover",
                    "spaceship",
                    "piano"
                ],
                "answer": "discover"
            }
        ]
    },
    {
        "id": "reading-l3-02",
        "title": "Mossy Log Story",
        "level": 3,
        "text": "Lena explores the mossy log while the forest grows quiet around her. A squirrel pauses near a stone marker, so Lena decides to discover what the marker means. She reads the clue, compares it with the map, and chooses the path beside the old tree.",
        "estimated_reading_time": "3 min",
        "vocabulary_words": [
            "discover",
            "observe"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A squirrel appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "discover",
                    "spaceship",
                    "piano"
                ],
                "answer": "discover"
            }
        ]
    },
    {
        "id": "reading-l3-03",
        "title": "Little Stream Story",
        "level": 3,
        "text": "Lena explores the little stream while the forest grows quiet around her. A owl pauses near a stone marker, so Lena decides to discover what the marker means. She reads the clue, compares it with the map, and chooses the path beside the old tree.",
        "estimated_reading_time": "3 min",
        "vocabulary_words": [
            "discover",
            "observe"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A owl appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "discover",
                    "spaceship",
                    "piano"
                ],
                "answer": "discover"
            }
        ]
    },
    {
        "id": "reading-l3-04",
        "title": "Fox Trail Story",
        "level": 3,
        "text": "Lena explores the fox trail while the forest grows quiet around her. A fox pauses near a stone marker, so Lena decides to discover what the marker means. She reads the clue, compares it with the map, and chooses the path beside the old tree.",
        "estimated_reading_time": "3 min",
        "vocabulary_words": [
            "discover",
            "observe"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A fox appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "discover",
                    "spaceship",
                    "piano"
                ],
                "answer": "discover"
            }
        ]
    },
    {
        "id": "reading-l3-05",
        "title": "Sunny Fern Story",
        "level": 3,
        "text": "Lena explores the sunny fern while the forest grows quiet around her. A deer pauses near a stone marker, so Lena decides to discover what the marker means. She reads the clue, compares it with the map, and chooses the path beside the old tree.",
        "estimated_reading_time": "3 min",
        "vocabulary_words": [
            "discover",
            "observe"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A deer appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "discover",
                    "spaceship",
                    "piano"
                ],
                "answer": "discover"
            }
        ]
    },
    {
        "id": "reading-l3-06",
        "title": "Acorn Map Story",
        "level": 3,
        "text": "Lena explores the acorn map while the forest grows quiet around her. A rabbit pauses near a stone marker, so Lena decides to discover what the marker means. She reads the clue, compares it with the map, and chooses the path beside the old tree.",
        "estimated_reading_time": "3 min",
        "vocabulary_words": [
            "discover",
            "observe"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A rabbit appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "discover",
                    "spaceship",
                    "piano"
                ],
                "answer": "discover"
            }
        ]
    },
    {
        "id": "reading-l3-07",
        "title": "Quiet Pond Story",
        "level": 3,
        "text": "Lena explores the quiet pond while the forest grows quiet around her. A squirrel pauses near a stone marker, so Lena decides to discover what the marker means. She reads the clue, compares it with the map, and chooses the path beside the old tree.",
        "estimated_reading_time": "3 min",
        "vocabulary_words": [
            "discover",
            "observe"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A squirrel appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "discover",
                    "spaceship",
                    "piano"
                ],
                "answer": "discover"
            }
        ]
    },
    {
        "id": "reading-l3-08",
        "title": "Deer Meadow Story",
        "level": 3,
        "text": "Lena explores the deer meadow while the forest grows quiet around her. A owl pauses near a stone marker, so Lena decides to discover what the marker means. She reads the clue, compares it with the map, and chooses the path beside the old tree.",
        "estimated_reading_time": "3 min",
        "vocabulary_words": [
            "discover",
            "observe"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A owl appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "discover",
                    "spaceship",
                    "piano"
                ],
                "answer": "discover"
            }
        ]
    },
    {
        "id": "reading-l3-09",
        "title": "Owl Lantern Story",
        "level": 3,
        "text": "Lena explores the owl lantern while the forest grows quiet around her. A fox pauses near a stone marker, so Lena decides to discover what the marker means. She reads the clue, compares it with the map, and chooses the path beside the old tree.",
        "estimated_reading_time": "3 min",
        "vocabulary_words": [
            "discover",
            "observe"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A fox appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "discover",
                    "spaceship",
                    "piano"
                ],
                "answer": "discover"
            }
        ]
    },
    {
        "id": "reading-l3-10",
        "title": "Berry Bridge Story",
        "level": 3,
        "text": "Lena explores the berry bridge while the forest grows quiet around her. A deer pauses near a stone marker, so Lena decides to discover what the marker means. She reads the clue, compares it with the map, and chooses the path beside the old tree.",
        "estimated_reading_time": "3 min",
        "vocabulary_words": [
            "discover",
            "observe"
        ],
        "questions": [
            {
                "id": "q1",
                "type": "multiple_choice",
                "prompt": "Where does Lena look?",
                "options": [
                    "Beside the old tree",
                    "Under her bed",
                    "Inside a cave"
                ],
                "answer": "Beside the old tree"
            },
            {
                "id": "q2",
                "type": "true_false",
                "prompt": "A deer appears in the story.",
                "options": [
                    "True",
                    "False"
                ],
                "answer": "True"
            },
            {
                "id": "q3",
                "type": "sequence",
                "prompt": "Put the story events in order.",
                "items": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ],
                "answer": [
                    "Lena enters the forest",
                    "Lena reads a clue",
                    "Lena chooses a path"
                ]
            },
            {
                "id": "q4",
                "type": "vocabulary_matching",
                "prompt": "Which word from the story is a vocabulary word?",
                "options": [
                    "discover",
                    "spaceship",
                    "piano"
                ],
                "answer": "discover"
            }
        ]
    }
]


class ReadingService:
    def __init__(
        self,
        child_repository: ChildRepository,
        passage_repository: ReadingPassageRepository,
        progress_repository: ReadingProgressRepository,
        daily_goal_service: DailyGoalService | None = None,
        achievement_service: AchievementService | None = None,
    ):
        self.child_repository = child_repository
        self.passage_repository = passage_repository
        self.progress_repository = progress_repository
        self.daily_goal_service = daily_goal_service
        self.achievement_service = achievement_service

    def get_child_or_create_default(self, db: Session) -> Child:
        child = self.child_repository.get_first(db)

        if child is None:
            child = self.child_repository.create_default_child(db)

        return child

    def seed_passages(self, db: Session) -> None:
        for item in READING_PASSAGES:
            existing = self.passage_repository.get_by_id(db, item["id"])
            if existing is not None:
                continue

            self.passage_repository.create(
                db,
                ReadingPassage(
                    id=item["id"],
                    title=item["title"],
                    level=item["level"],
                    text=item["text"],
                    estimated_reading_time=item["estimated_reading_time"],
                    vocabulary_words=json.dumps(item["vocabulary_words"]),
                    questions=json.dumps(item["questions"]),
                ),
            )
        db.flush()

    def serialize_passage(self, passage: ReadingPassage) -> dict:
        questions = json.loads(passage.questions)
        safe_questions = []

        for question in questions:
            safe_question = {
                key: value
                for key, value in question.items()
                if key != "answer"
            }
            safe_questions.append(safe_question)

        return {
            "id": passage.id,
            "title": passage.title,
            "level": passage.level,
            "text": passage.text,
            "estimated_reading_time": passage.estimated_reading_time,
            "vocabulary_words": json.loads(passage.vocabulary_words),
            "questions": safe_questions,
        }

    def list_passages(self, db: Session, level: int) -> list[dict]:
        self.seed_passages(db)
        db.commit()
        return [
            self.serialize_passage(passage)
            for passage in self.passage_repository.list_by_level(db, level)
        ]

    def get_passage(self, db: Session, passage_id: str) -> ReadingPassage:
        self.seed_passages(db)
        passage = self.passage_repository.get_by_id(db, passage_id)

        if passage is None:
            raise HTTPException(status_code=404, detail="Reading passage not found")

        return passage

    def serialize_progress(self, progress: ReadingProgress) -> dict:
        accuracy = (
            progress.correct_answers / progress.questions_answered
            if progress.questions_answered
            else 0
        )

        return {
            "child_id": progress.child_id,
            "passage_id": progress.passage_id,
            "level": progress.level,
            "questions_answered": progress.questions_answered,
            "correct_answers": progress.correct_answers,
            "vocabulary_learned": progress.vocabulary_learned,
            "xp_awarded": progress.xp_awarded,
            "completed": progress.completed,
            "completed_at": progress.completed_at,
            "accuracy": accuracy,
        }

    def get_progress(self, db: Session) -> list[dict]:
        child = self.get_child_or_create_default(db)
        return [
            self.serialize_progress(progress)
            for progress in self.progress_repository.list_by_child(db, child.id)
        ]

    def get_progress_summary(self, db: Session) -> dict:
        child = self.get_child_or_create_default(db)
        progress_items = self.progress_repository.list_by_child(db, child.id)
        completed_items = [item for item in progress_items if item.completed]
        questions_answered = sum(item.questions_answered for item in completed_items)
        correct_answers = sum(item.correct_answers for item in completed_items)
        vocabulary_words = []

        for item in completed_items:
            passage = self.passage_repository.get_by_id(db, item.passage_id)
            if passage is None:
                continue

            for word in json.loads(passage.vocabulary_words):
                if word not in vocabulary_words:
                    vocabulary_words.append(word)

        return {
            "completed_passage_ids": [item.passage_id for item in completed_items],
            "passages_completed": len(completed_items),
            "questions_answered": questions_answered,
            "correct_answers": correct_answers,
            "accuracy": correct_answers / questions_answered if questions_answered else 0,
            "total_xp_earned": sum(item.xp_awarded for item in completed_items),
            "vocabulary_learned": len(vocabulary_words),
            "vocabulary_words": vocabulary_words,
        }

    def normalize_answer(self, value):
        if isinstance(value, list):
            return [self.normalize_answer(item) for item in value]

        return str(value or "").strip().lower()

    def score_answers(self, passage: ReadingPassage, answers: dict) -> list[dict]:
        questions = json.loads(passage.questions)
        results = []

        for question in questions:
            expected = question["answer"]
            actual = answers.get(question["id"])
            correct = self.normalize_answer(actual) == self.normalize_answer(expected)
            results.append(
                {
                    "question_id": question["id"],
                    "correct": correct,
                    "expected_answer": expected,
                }
            )

        return results

    def apply_reading_xp(self, child: Child, xp: int) -> None:
        child.xp += xp
        child.level = calculate_level_from_xp(child.xp)
        child.tree_stage = calculate_tree_stage_from_xp(child.xp)

    def submit_answers(self, db: Session, passage_id: str, answers: dict) -> dict:
        child = self.get_child_or_create_default(db)
        passage = self.get_passage(db, passage_id)
        existing_progress = self.progress_repository.get_by_child_and_passage(
            db,
            child.id,
            passage.id,
        )

        if existing_progress is not None and existing_progress.completed:
            return {
                "child": child,
                "progress": self.serialize_progress(existing_progress),
                "score": existing_progress.correct_answers,
                "total_questions": existing_progress.questions_answered,
                "accuracy": (
                    existing_progress.correct_answers / existing_progress.questions_answered
                    if existing_progress.questions_answered
                    else 0
                ),
                "rewards": {"xp": 0},
                "events": ["Reading Passage Already Completed"],
                "question_results": [],
                "daily_goal": None,
                "streak": None,
                "achievements_unlocked": [],
                "duplicate": True,
            }

        question_results = self.score_answers(passage, answers)
        score = sum(1 for result in question_results if result["correct"])
        total_questions = len(question_results)
        xp_awarded = score * READING_CORRECT_ANSWER_XP
        daily_goal_result = None
        completed_daily_goal_result = None
        events = ["Reading Passage Completed"]
        achievements_unlocked = []

        if xp_awarded:
            self.apply_reading_xp(child, xp_awarded)
            events.append("Reading XP Awarded")

        if self.daily_goal_service is not None:
            for _ in range(score):
                daily_goal_result = self.daily_goal_service.record_correct_answer(db)
                if daily_goal_result["completed_today"]:
                    completed_daily_goal_result = daily_goal_result
            if daily_goal_result:
                events.extend(daily_goal_result["events"])

        progress = existing_progress or ReadingProgress(
            child_id=child.id,
            passage_id=passage.id,
            level=passage.level,
        )
        progress.questions_answered = total_questions
        progress.correct_answers = score
        progress.vocabulary_learned = len(json.loads(passage.vocabulary_words)) if score else 0
        progress.xp_awarded = xp_awarded
        progress.completed = True
        progress.completed_at = datetime.utcnow()

        if existing_progress is None:
            self.progress_repository.create(db, progress)

        db.flush()

        if self.achievement_service is not None and completed_daily_goal_result:
            if completed_daily_goal_result["completed_today"]:
                achievements_unlocked.extend(
                    self.achievement_service.evaluate(
                        db,
                        "daily_goal_completed",
                        child=child,
                        source_adventure="reading",
                        daily_goal=completed_daily_goal_result["daily_goal"],
                    )
                )
                achievements_unlocked.extend(
                    self.achievement_service.evaluate(
                        db,
                        "streak_updated",
                        child=child,
                        source_adventure="reading",
                        streak=completed_daily_goal_result["streak"],
                    )
                )

        db.commit()
        db.refresh(child)
        db.refresh(progress)

        if daily_goal_result:
            db.refresh(daily_goal_result["daily_goal"])
            db.refresh(daily_goal_result["streak"])

        return {
            "child": child,
            "progress": self.serialize_progress(progress),
            "score": score,
            "total_questions": total_questions,
            "accuracy": score / total_questions if total_questions else 0,
            "rewards": {"xp": xp_awarded},
            "events": events,
            "question_results": question_results,
            "daily_goal": daily_goal_result["daily_goal"] if daily_goal_result else None,
            "streak": daily_goal_result["streak"] if daily_goal_result else None,
            "achievements_unlocked": achievements_unlocked,
            "duplicate": False,
        }
