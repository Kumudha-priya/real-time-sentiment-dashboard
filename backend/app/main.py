from fastapi import FastAPI, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import UploadFile, File

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.core.limiter import limiter
from app.database import engine
from app.models import Base

# routers
from app.routes.dashboard import router as dashboard_router
from app.routes.analyze import router as analyze_router
from app.routes.trends import router as trends_router
from app.routes.topics import router as topics_router
from app.routes.sentiments import router as sentiments_router
from app.routes.ingest import router as ingest_router
from app.routes.dataset import router as dataset_router
from app.routes.live import router as live_router
from app.routes.result import router as result_router
from app.analytics_app import router as analytics_router

from app.tasks_pipeline import run_pipeline_task
from app.websocket_manager import manager
from app.auth.routes import router as auth_router
from app.routes.export import router as export_router
from app.routes.override import router as override_router
from app.routes.health import router as health_router
import asyncio


app = FastAPI(
    title="Real-Time Sentiment Dashboard",
    version="1.0.0",
    swagger_ui_init_oauth={
        "usePkceWithAuthorizationCodeGrant": True
    }
)
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routers
app.include_router(dashboard_router)
app.include_router(analyze_router)
app.include_router(trends_router)
app.include_router(topics_router)
app.include_router(sentiments_router)
app.include_router(ingest_router)
app.include_router(dataset_router)
app.include_router(live_router)
app.include_router(result_router)
app.include_router(analytics_router)
app.include_router(auth_router)
app.include_router(
    export_router
)
app.include_router(
    override_router
)
app.include_router(health_router)

@app.get("/")
async def home():
    return {"message": "Backend Running"}

@app.post("/run-pipeline")
async def pipeline():
    task = run_pipeline_task.delay()
    return {"task_id": task.id, "status": "processing"}

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

# ==============================
# WEBSOCKET LIVE UPDATES
# ==============================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await manager.connect(websocket)

    try:

        while True:

            await asyncio.sleep(10)


    except Exception:

        manager.disconnect(websocket)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc)}
    )