from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_dataset_requires_login():
    response = client.get("/dataset")
    assert response.status_code == 401


def test_dashboard_requires_login():
    response = client.get("/dashboard")
    assert response.status_code == 401