from fastapi import APIRouter
from app.database import engine

router = APIRouter()


@router.get("/health")
def health_check():

    # Database check
    try:
        connection = engine.connect()
        connection.close()

        database_status = "connected"

    except Exception:

        database_status = "disconnected"


    # Redis check
    try:
        import redis

        r = redis.Redis(
            host="localhost",
            port=6379
        )

        r.ping()

        redis_status = "connected"

    except Exception:

        redis_status = "disconnected"


    # Celery check
    try:

        from app.celery_worker import celery

        celery.control.inspect().active()

        celery_status = "running"

    except Exception:

        celery_status = "stopped"



    return {

        "api":"running",

        "database":database_status,

        "redis":redis_status,

        "celery":celery_status

    }