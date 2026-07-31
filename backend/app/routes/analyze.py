from fastapi import APIRouter,Depends, HTTPException
from pydantic import BaseModel
from celery.result import AsyncResult
from app.celery_worker import celery
from app.tasks import analyze_text_task
from app.core.limiter import limiter
from fastapi import Request
from app.auth.dependencies import get_current_user

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str
@router.get("/result/{task_id}")
async def get_result(
    task_id: str,
    current_user = Depends(get_current_user)
):

    task = AsyncResult(task_id, app=celery)

    if task.state == "PENDING":
        return {
            "status": "processing"
        }

    if task.state == "SUCCESS":
        return {
            "status": "done",
            "data": task.result
        }

    if task.state == "FAILURE":
        return {
            "status": "failed",
            "error": str(task.result)
        }

    return {
        "status": task.state
    }

@limiter.limit("5/minute")
@router.post("/analyze")
async def analyze(
    request_http: Request,
    request: AnalyzeRequest,
    current_user = Depends(get_current_user)
):
    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty"
        )

    task = analyze_text_task.delay(request.text)

    return {
        "task_id": task.id,
        "status": "processing"
    }