from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Auth Schemas ---
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

# --- Other Schemas ---
class ImageBase(BaseModel):
    image_url: str

class ImageOut(ImageBase):
    id: int
    class Config:
        orm_mode = True

class SellerOut(BaseModel):
    id: int
    name: str
    email: Optional[str] = None # <--- NEW: Added Email here
    phone: str
    is_verified: bool
    profile_image: Optional[str] = None
    class Config:
        orm_mode = True

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

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