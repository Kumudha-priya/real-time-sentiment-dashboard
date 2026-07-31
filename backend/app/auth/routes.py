from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from app.database import SessionLocal
from app.models import User

from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)



class RegisterRequest(BaseModel):

    email: str
    password: str

@router.post("/register")
def register(
    user: RegisterRequest
):

    db = SessionLocal()


    existing_user = (
        db.query(User)
        .filter(
            User.email == user.email
        )
        .first()
    )


    if existing_user:

        db.close()

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    new_user = User(

        email=user.email,

        password=hash_password(
            user.password
        )

    )


    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    db.close()


    return {

        "message":
        "User created successfully",

        "email":
        new_user.email
    }

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    db = SessionLocal()


    existing_user = (
        db.query(User)
        .filter(
            User.email == form_data.username
        )
        .first()
    )


    if not existing_user:

        db.close()

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    password_valid = verify_password(
        form_data.password,
        existing_user.password
    )


    if not password_valid:

        db.close()

        raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )


    token = create_access_token(
        {
            "sub": existing_user.email
        }
    )


    db.close()


    return {

        "access_token": token,

        "token_type": "bearer"
    }