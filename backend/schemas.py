from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Auth & User ---
class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    gender: str
    address: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    user_id: int
    profile_image: Optional[str] = None

class ChangePassword(BaseModel):
    old_password: str
    new_password: str

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

# --- Reviews & Messages ---
class ReviewCreate(BaseModel):
    reviewee_id: int
    rating: int
    comment: str

class ReviewOut(BaseModel):
    id: int
    reviewer_name: str
    rating: int
    comment: Optional[str]
    created_at: datetime
    class Config:
        orm_mode = True

class MessageCreate(BaseModel):
    receiver_id: int
    content: str

class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    timestamp: datetime
    is_read: bool = False
    class Config:
        orm_mode = True

class ChatContact(BaseModel):
    user_id: int
    name: str
    image: Optional[str]
    last_message: str

# --- Animals ---
class ImageBase(BaseModel):
    image_url: str

class ImageOut(ImageBase):
    id: int
    class Config:
        orm_mode = True

class SellerOut(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: str
    is_verified: bool
    profile_image: Optional[str] = None
    average_rating: float = 0.0
    review_count: int = 0
    class Config:
        orm_mode = True

class AnimalBase(BaseModel):
    name: Optional[str] = None
    animal_type: str
    breed: Optional[str] = None
    price: float
    weight: float
    color: str
    city: str
    description: Optional[str] = None

class AnimalOut(AnimalBase):
    id: int
    created_at: datetime
    views: int = 0
    is_sold: bool = False
    seller: SellerOut
    images: List[ImageOut] = []

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    name: str
    gender: Optional[str] = None
    address: Optional[str] = None

class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    gender: Optional[str] = None
    address: Optional[str] = None
    profile_image: Optional[str] = None
    class Config:
        orm_mode = True