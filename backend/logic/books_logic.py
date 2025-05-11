from database.database import want_to_read_collection


async def add_want_to_read(user_id: str, book_id: str):
    existing = await want_to_read_collection.find_one({"user_id": user_id, "book_id": book_id})
    if existing:
        return None  # Book already in Want to Read list

    result = await want_to_read_collection.insert_one({"user_id": user_id, "book_id": book_id})
    return str(result.inserted_id)


async def get_want_to_read(user_id: str):
    books = await want_to_read_collection.find({"user_id": user_id}).to_list(100)
    return [{"id": str(book["_id"]), "book_id": book["book_id"]} for book in books]


async def remove_want_to_read(user_id: str, book_id: str):
    result = await want_to_read_collection.delete_one({"user_id": user_id, "book_id": book_id})
    return result.deleted_count > 0
