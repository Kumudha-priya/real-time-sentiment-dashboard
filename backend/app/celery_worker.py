from celery import Celery


celery = Celery(
    "worker",
    broker="redis://127.0.0.1:6379/0",
    backend="redis://127.0.0.1:6379/0"
)


celery.conf.update(

    broker_connection_retry_on_startup=True,

    broker_transport_options={
        "visibility_timeout":3600,
        "socket_keepalive":True,
        "socket_timeout":60,
        "socket_connect_timeout":60,
    },

    result_backend_transport_options={
        "socket_keepalive":True,
        "socket_timeout":60,
        "socket_connect_timeout":60,
    },

    worker_prefetch_multiplier=1,

    task_acks_late=True

)


celery.conf.imports=(
    "app.tasks",
    "app.tasks_ingestion",
    "app.tasks_pipeline"
)