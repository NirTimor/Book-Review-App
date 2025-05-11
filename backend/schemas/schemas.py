from typing import Optional, List
from pydantic import BaseModel, EmailStr, conint


class Review(BaseModel):
    user_id: str
    book_name: str
    content: str
    rating: int


class User(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    user_id: Optional[str]


class WantToRead(BaseModel):
    user_id: str
    book_id: str


class SavedBook(BaseModel):
    user_id: str
    google_book_id: str
    title: str
    authors: List[str]
    thumbnail: Optional[str] = None
    shelf: str
