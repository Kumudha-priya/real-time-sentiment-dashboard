from fastapi import APIRouter
from app.celery_worker import celery

router = APIRouter()

@router.get("/result/{task_id}")
def get_result(task_id: str):
    result = celery.AsyncResult(task_id)

    if result.ready():
        return {
            "status": "done",
            "data": result.result
        }

    return {
        "status": "processing"
    }