from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    phone: str
    password: str

class UserLogin(BaseModel):
    phone: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    user_id: int
    profile_image: Optional[str] = None

class ImageBase(BaseModel):
    image_url: str

class ImageOut(ImageBase):
    id: int
    class Config:
        orm_mode = True

class SellerOut(BaseModel):
    id: int
    name: str
    phone: str
    is_verified: bool
    profile_image: Optional[str] = None
    class Config:
        orm_mode = True

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

# --- Updated Animal Schemas ---
class AnimalBase(BaseModel):
    name: Optional[str] = None # <--- New
    animal_type: str
    breed: Optional[str] = None # Ensure breed is here
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