TREEHOUSE_SHORTCUTS = {
    "reading-forest-shortcut": {
        "shortcut_id": "reading-forest-shortcut",
        "region_id": "reading",
        "display_name": "Reading Forest Shortcut",
        "description": "Build an enchanted bookshelf that can lead straight to Reading Forest.",
        "maximum_stage": 4,
        "display_order": 1,
        "resource": {
            "item_key": "reading_leaf",
            "item_name": "Reading Leaf",
        },
        "stages": {
            0: {
                "required_progress": 3,
                "resource_quantity": 0,
                "message": "Complete 3 Reading Forest passages to discover the bookshelf blueprint.",
            },
            1: {
                "required_progress": 3,
                "resource_quantity": 1,
                "message": "The blueprint is ready. Add 1 Reading Leaf to start the frame.",
            },
            2: {
                "required_progress": 5,
                "resource_quantity": 1,
                "message": "The frame is waiting for more story magic and 1 Reading Leaf.",
            },
            3: {
                "required_progress": 8,
                "resource_quantity": 2,
                "message": "Almost done. Add 2 Reading Leaves to finish the enchanted bookshelf.",
            },
            4: {
                "required_progress": 8,
                "resource_quantity": 0,
                "message": "The enchanted bookshelf is complete.",
            },
        },
    },
}

TREEHOUSE_SHORTCUT_ORDER = ["reading-forest-shortcut"]
