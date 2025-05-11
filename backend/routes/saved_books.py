from fastapi import APIRouter, HTTPException
from schemas.schemas import SavedBook
from database.database import saved_books_collection
from bson import ObjectId

router = APIRouter()


@router.post("/save_book")
async def save_book(book: SavedBook):
    existing = await saved_books_collection.find_one({
        "user_id": book.user_id,
        "google_book_id": book.google_book_id
    })
    if existing:
        await saved_books_collection.update_one(
            {"_id": existing["_id"]},
            {"$set": {"shelf": book.shelf}}
        )
        return {"message": "Shelf updated"}
    await saved_books_collection.insert_one(book.dict())
    return {"message": "Book saved"}


@router.delete("/remove_book/{user_id}/{google_book_id}")
async def remove_book(user_id: str, google_book_id: str):
    result = await saved_books_collection.delete_one({
        "user_id": user_id,
        "google_book_id": google_book_id
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"message": "Book removed"}


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
