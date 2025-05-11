from fastapi import FastAPI
from routes import user_routes, books_routes, saved_books
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# CORS Settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_routes.router, tags=["Authentication API"])
app.include_router(books_routes.router, tags=["Books/Reviews API"])
app.include_router(saved_books.router, tags=["Saved_Books/Reviews API"])

