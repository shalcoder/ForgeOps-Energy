"""The live agent service must reject workspaces for a different demo case."""

from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_workbench_rejects_mismatched_incident_and_batch():
    response = client.get(
        "/api/agent/workbench",
        params={"incident_id": "INC-ENG-2401", "batch_id": "BATCH-FD-2408"},
    )

    assert response.status_code == 409
    assert "INC-2407-001 / B-2407-184" in response.json()["detail"]


def test_pipeline_rejects_mismatched_incident_before_running_agents():
    response = client.post(
        "/api/agent/pipeline",
        json={
            "query": "Show root cause evidence",
            "incident_id": "INC-ENG-2401",
            "batch_id": "BATCH-FD-2408",
        },
    )

    assert response.status_code == 409
    assert "different case" in response.json()["detail"]
