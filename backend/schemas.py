from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Auth Schemas ---
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

# --- Image Schemas ---
class ImageBase(BaseModel):
    image_url: str

class ImageOut(ImageBase):
    id: int
    class Config:
        orm_mode = True

# --- Seller/User Schemas ---
class SellerOut(BaseModel):
    id: int
    name: str
    phone: str
    is_verified: bool
    class Config:
        orm_mode = True

# --- Animal Schemas ---
class AnimalBase(BaseModel):
    animal_type: str
    price: float
    weight: float
    color: str
    city: str
    description: Optional[str] = None

class AnimalOut(AnimalBase):
    id: int
    created_at: datetime
    views: int = 0          # <--- New
    is_sold: bool = False   # <--- New
    seller: SellerOut
    images: List[ImageOut] = []

    class Config:
        orm_mode = True