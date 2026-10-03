"""Durable verification feedback used to recalibrate local baseline metadata."""

from __future__ import annotations

import json
import sqlite3
import os
from pathlib import Path
from typing import Any, Dict


DEFAULT_REGISTRY_PATH = Path(
    os.getenv("FORGEOPS_DATA_DIR", str(Path(__file__).parent))
) / "feedback_registry.db"


class FeedbackRegistry:
    """Small SQLite registry for verified model/baseline feedback."""

    def __init__(self, path: Path | str = DEFAULT_REGISTRY_PATH):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with sqlite3.connect(self.path) as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS verification_feedback (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    incident_id TEXT NOT NULL,
                    equipment_id TEXT NOT NULL,
                    calibrated_target_sec REAL NOT NULL,
                    model_accuracy_pct REAL NOT NULL,
                    prediction_error_pct REAL NOT NULL,
                    payload_json TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )

    def record(self, feedback: Dict[str, Any]) -> Dict[str, Any]:
        payload = dict(feedback)
        with sqlite3.connect(self.path) as connection:
            cursor = connection.execute(
                """
                INSERT INTO verification_feedback (
                    incident_id, equipment_id, calibrated_target_sec,
                    model_accuracy_pct, prediction_error_pct, payload_json, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    str(payload["incident_id"]),
                    str(payload["feedback_payload"]["equipment_id"]),
                    float(payload["feedback_payload"]["calibrated_target_sec"]),
                    float(payload["feedback_payload"]["model_accuracy_pct"]),
                    float(payload["prediction_error_pct"]),
                    json.dumps(payload, sort_keys=True),
                    str(payload["feedback_payload"]["timestamp"]),
                ),
            )
            feedback_id = cursor.lastrowid
        return {"feedback_id": feedback_id, "status": "RECORDED", **payload}

    def latest(self, equipment_id: str) -> Dict[str, Any] | None:
        with sqlite3.connect(self.path) as connection:
            row = connection.execute(
                """
                SELECT payload_json FROM verification_feedback
                WHERE equipment_id = ? ORDER BY id DESC LIMIT 1
                """,
                (equipment_id,),
            ).fetchone()
        return json.loads(row[0]) if row else None
