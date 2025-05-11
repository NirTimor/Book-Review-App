from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "book_review_db"

client = AsyncIOMotorClient(MONGO_URI)
database = client[DB_NAME]

reviews_collection = database["reviews"]
users_collection = database["users"]
want_to_read_collection = database["want_to_read"]
saved_books_collection = database["saved_books"]