from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


SECRET_KEY = "your-secret-key-change-this"
ALGORITHM = "HS256"


def hash_password(password: str):

    return pwd_context.hash(password[:72])


def verify_password(
    plain_password,
    hashed_password
):

    return pwd_context.verify(
        plain_password[:72],
        hashed_password
    )



def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=60
    )

    to_encode.update(
        {
            "exp": expire
        }
    )


    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


    return token