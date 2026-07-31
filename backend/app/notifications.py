from app.websocket_manager import manager
import asyncio

def send_negative_alert(percentage):

    alert_data = {

        "type": "alert",

        "severity": "high",

        "message":
        f"Negative sentiment increased {percentage}%"

    }

    try:

        loop = asyncio.get_event_loop()

        loop.run_until_complete(
            manager.broadcast(alert_data)
        )

    except RuntimeError:

        asyncio.run(
            manager.broadcast(alert_data)
        )
        