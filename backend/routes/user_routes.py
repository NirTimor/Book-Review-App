from database.database import *
from logic.user_logic import *
from fastapi import Request
from fastapi import APIRouter, HTTPException
from schemas.schemas import *

router = APIRouter()


# Registration
@router.post("/register")
async def register_user(user: User):
    user_id = await create_user(user)
    if user_id:
        return {"message": "User registered successfully!", "user_id": str(user_id)}
    else:
        raise HTTPException(status_code=400, detail="Sorry, A User with this email already exists.")


# Login users
@router.post("/login")
async def login_user(request: Request):
    data = await request.json()
    email = data.get('email')
    password = data.get('password')
    user_info = await authenticate_user(email, password)

    if user_info:
        user = await users_collection.find_one({"_id": user_info["user_id"]})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "message": "Successfully Logged in!",
            "user_id": user_info["user_id"],
            "full_name": user.get("full_name") or user.get("username")
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")


@router.get("/user/{user_id}")
async def get_user_profile(user_id: str):
    user = await users_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "username": user.get("username"),
        "profile_pic": user.get("profile_pic", None)  # Optional
    }


@router.get("/user_stats/{user_id}")
async def get_user_stats(user_id: str):
    reviews = await reviews_collection.find({"user_id": user_id}).to_list(length=100)
    if not reviews:
        return {
            "total_reviews": 0,
            "average_rating": 0.0
        }

    total_reviews = len(reviews)
    average_rating = sum([r["rating"] for r in reviews]) / total_reviews

    return {
        "total_reviews": total_reviews,
        "average_rating": round(average_rating, 2)
    }


@router.get("/user_shelves/{user_id}")
async def get_user_shelves(user_id: str):
    books = await saved_books_collection.find({"user_id": user_id}).to_list(length=100)
    shelves = {
        "want_to_read": [],
        "currently_reading": [],
        "read": []
    }

    for book in books:
        shelf = book.get("shelf")
        if shelf in shelves:
            shelves[shelf].append(book)

    return shelves
