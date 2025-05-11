from logic.books_logic import *
from database.database import reviews_collection
from fastapi import APIRouter, HTTPException
from schemas.schemas import *
from bson import ObjectId
from fastapi import Query
import requests
router = APIRouter()
GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"


def review_serializer(review):
    review["id"] = str(review["_id"])
    del review["_id"]
    return review


# Write Review on a book
@router.post("/add_review")
async def add_review(review: Review):
    new_review = {
        "user_id": review.user_id,
        "book_name": review.book_name,
        "content": review.content,
        "rating": review.rating
    }
    result = await reviews_collection.insert_one(new_review)

    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to add review")

    return {"message": "Review added successfully", "review_id": str(result.inserted_id)}


# Search for books with query parameters
@router.get("/search")
def search_books(query: str, startIndex: int = 0, maxResults: int = 10):
    params = {
        "q": query,
        "startIndex": startIndex,
        "maxResults": maxResults
    }
    response = requests.get(GOOGLE_BOOKS_API_URL, params=params)
    data = response.json()

    books = [
        {
            "id": item.get("id"),
            "title": item.get("volumeInfo", {}).get("title"),
            "authors": item.get("volumeInfo", {}).get("authors", []),
            "thumbnail": item.get("volumeInfo", {}).get("imageLinks", {}).get("thumbnail"),
            "preview_link": item.get("volumeInfo", {}).get("previewLink"),
        }
        for item in data.get("items", [])
    ]

    return {"books": books}


# Get all Reviews by specific book id
@router.get("/reviews/{book_id}", response_model=list[Review])
async def get_reviews(book_id: str):
    reviews = await reviews_collection.find({"book_id": book_id}).to_list(100)
    return [{**review, "id": str(review["_id"])} for review in reviews]


# Update review you wrote
@router.put("/reviews/update")
async def update_review(review_update: dict):
    review_id = review_update.get("review_id")
    if not review_id:
        raise HTTPException(status_code=400, detail="review_id is required")
    try:
        obj_id = ObjectId(review_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid review_id format")

    existing_review = await reviews_collection.find_one({"_id": obj_id})
    if not existing_review:
        raise HTTPException(status_code=404, detail="Review not found")

    result = await reviews_collection.update_one(
        {"_id": obj_id},
        {"$set": {k: v for k, v in review_update.items() if k != "review_id"}}
    )
    if result.modified_count:
        return {"message": "Review updated successfully"}

    raise HTTPException(status_code=404, detail="No changes made to the review")


# Delete review you wrote
@router.delete("/reviews/delete")
async def delete_review(review_id: str = Query(...)):
    try:
        obj_id = ObjectId(review_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid review_id format")

    existing_review = await reviews_collection.find_one({"_id": obj_id})
    if not existing_review:
        raise HTTPException(status_code=404, detail="Review not found")

    result = await reviews_collection.delete_one({"_id": obj_id})

    if result.deleted_count:
        return {"message": "Review deleted successfully"}

    raise HTTPException(status_code=404, detail="Review not found")


# Get average rating of a book
@router.get("/book_rating/{book_id}")
async def get_book_rating(book_id: str):
    reviews = await reviews_collection.find({"book_id": book_id}).to_list(100)
    if not reviews:
        return {"book_id": book_id, "average_rating": None, "total_reviews": 0}

    average_rating = sum(r["rating"] for r in reviews) / len(reviews)
    return {"book_id": book_id, "average_rating": round(average_rating, 2), "total_reviews": len(reviews)}


#  Get All Reviews by a User
@router.get("/user_reviews/{user_id}")
async def get_user_reviews(user_id: str):
    reviews = await reviews_collection.find({"user_id": user_id}).to_list(length=None)
    return [review_serializer(r) for r in reviews]


# Save Books to "Want to Read" List
@router.post("/want_to_read")
async def add_to_want_to_read(want: WantToRead):
    existing_entry = await want_to_read_collection.find_one({"user_id": want.user_id, "book_id": want.book_id})
    if existing_entry:
        raise HTTPException(status_code=400, detail="Book already in Want to Read list")

    result = await want_to_read_collection.insert_one(want.dict())
    return {"message": "Book added to Want to Read list", "id": str(result.inserted_id)}


# Get "Want to Read" List for a User
@router.get("/want_to_read/{user_id}")
async def get_want_to_read(user_id: str):
    books = await want_to_read_collection.find({"user_id": user_id}).to_list(100)
    return [{"id": str(book["_id"]), "book_id": book["book_id"]} for book in books]


# Remove a book from want to read
@router.delete("/want_to_read/{user_id}/{book_id}")
async def remove_from_want_to_read(user_id: str, book_id: str):
    result = await want_to_read_collection.delete_one({"user_id": user_id, "book_id": book_id})
    if result.deleted_count:
        return {"message": "Book removed from Want to Read list"}
    raise HTTPException(status_code=404, detail="Book not found in Want to Read list")


# fetch book details from Google Books API
@router.get("/book/{book_id}")
async def get_book_details(book_id: str):
    book_url = f"{GOOGLE_BOOKS_API_URL}/{book_id}"
    response = requests.get(book_url)

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Book not found")

    return response.json()


@router.get("/user_profile/{user_id}")
async def get_user_profile(user_id: str):
    user_reviews = await reviews_collection.find({"user_id": user_id}).to_list(100)
    want_to_read_books = await want_to_read_collection.find({"user_id": user_id}).to_list(100)

    return {
        "user_id": user_id,
        "reviews": [{**review, "id": str(review["_id"])} for review in user_reviews],
        "want_to_read": [{"id": str(book["_id"]), "book_id": book["book_id"]} for book in want_to_read_books]
    }
