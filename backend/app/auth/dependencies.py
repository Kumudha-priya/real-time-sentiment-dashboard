from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt


SECRET_KEY = "your-secret-key-change-this"
ALGORITHM = "HS256"


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    print("TOKEN RECEIVED FROM SWAGGER:", token)

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")


        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )


        return email


    except:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )