import os
import shutil
import uuid
from typing import List, Optional, Dict
from datetime import datetime, timedelta

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status, WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, func
from passlib.context import CryptContext
from jose import JWTError, jwt

import models, schemas, database
from ml_utils import predict_animal_price

# --- CONFIGURATION ---
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Create Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Animal Marketplace API")

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- WEBSOCKET MANAGER ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()


# --- AUTH HELPERS ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# --- AUTH ENDPOINTS ---

@app.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # 1. Check Email
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. Check Phone
    if db.query(models.User).filter(models.User.phone == user.phone).first():
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    # 3. Create User
    hashed_pw = get_password_hash(user.password)
    new_user = models.User(
        name=user.name, email=user.email, phone=user.phone, 
        gender=user.gender, address=user.address, hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(data={"sub": new_user.email})
    return {
        "access_token": token, "token_type": "bearer", 
        "user_name": new_user.name, "user_id": new_user.id, "profile_image": new_user.profile_image
    }

@app.post("/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user_name": user.name, "user_id": user.id, "profile_image": user.profile_image}


# --- USER PROFILE & SETTINGS ---

@app.put("/users/me/image")
def update_profile_image(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    # --- FIX IS HERE: Add 'image/webp' and print the type for debugging ---
    print(f"Attempting to upload: {file.filename} | Type: {file.content_type}")
    
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed. Use JPG, PNG, or WebP.")

    # ... Rest of the function remains the same ...
    upload_dir = "static/uploads"
    os.makedirs(upload_dir, exist_ok=True) 

    clean_filename = file.filename.replace(" ", "_")
    unique_filename = f"user_{current_user.id}_{int(datetime.utcnow().timestamp())}_{clean_filename}"
    file_location = f"{upload_dir}/{unique_filename}"

    try:
        with open(file_location, "wb+") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        print(f"Error saving file: {e}")
        raise HTTPException(status_code=500, detail="Server error: Could not save image")

    image_url = f"http://localhost:8000/{file_location}"
    current_user.profile_image = image_url
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return {"image_url": image_url}

@app.post("/users/change-password")
def change_password(
    data: schemas.ChangePassword,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@app.post("/forgot-password")
def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User with this email not found")
    
    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    db.commit()
    return {"message": "Reset link generated successfully.", "reset_token": reset_token}

@app.post("/reset-password")
def reset_password(data: schemas.PasswordResetConfirm, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.reset_token == data.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    user.hashed_password = get_password_hash(data.new_password)
    user.reset_token = None
    db.commit()
    return {"message": "Password reset successfully. You can now login."}


# --- ANIMAL LISTINGS ---

@app.post("/animals/", response_model=schemas.AnimalOut)
def create_animal_listing(
    animal_type: str = Form(...), name: Optional[str] = Form(None), breed: str = Form(...),
    price: float = Form(...), weight: float = Form(...), color: str = Form(...),
    city: str = Form(...), description: str = Form(""), files: List[UploadFile] = File(...),
    current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)
):
    new_animal = models.Animal(
        seller_id=current_user.id, name=name, animal_type=animal_type, breed=breed,
        price=price, weight=weight, color=color, city=city, description=description
    )
    db.add(new_animal)
    db.commit()
    db.refresh(new_animal)

    for file in files:
        file_location = f"static/uploads/{new_animal.id}_{file.filename}"
        with open(file_location, "wb+") as buffer:
            shutil.copyfileobj(file.file, buffer)
        image_url = f"http://localhost:8000/{file_location}"
        db.add(models.AnimalImage(animal_id=new_animal.id, image_url=image_url))
    
    db.commit()
    db.refresh(new_animal)
    
    avg_rating = db.query(func.avg(models.Review.rating)).filter(models.Review.reviewee_id == current_user.id).scalar() or 0.0
    count_rating = db.query(models.Review).filter(models.Review.reviewee_id == current_user.id).count()

    return {
        **new_animal.__dict__,
        "seller": {**current_user.__dict__, "average_rating": avg_rating, "review_count": count_rating},
        "images": new_animal.images
    }

@app.get("/animals/", response_model=List[schemas.AnimalOut])
def get_animals(
    type: Optional[str] = None, city: Optional[str] = None, min_price: Optional[float] = None,
    max_price: Optional[float] = None, search: Optional[str] = None,
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Animal)
    if type and type != "All": query = query.filter(models.Animal.animal_type == type)
    if city: query = query.filter(models.Animal.city.ilike(f"%{city}%"))
    if min_price: query = query.filter(models.Animal.price >= min_price)
    if max_price: query = query.filter(models.Animal.price <= max_price)
    if search: query = query.filter(or_(models.Animal.description.ilike(f"%{search}%"), models.Animal.breed.ilike(f"%{search}%")))

    animals = query.order_by(models.Animal.created_at.desc()).all()
    
    results = []
    for a in animals:
        seller = a.seller
        avg = db.query(func.avg(models.Review.rating)).filter(models.Review.reviewee_id == seller.id).scalar() or 0.0
        count = db.query(models.Review).filter(models.Review.reviewee_id == seller.id).count()
        seller_dict = {**seller.__dict__, "average_rating": avg, "review_count": count}
        results.append({**a.__dict__, "seller": seller_dict, "images": a.images})

    return results

@app.get("/animals/{animal_id}", response_model=schemas.AnimalOut)
def get_animal_detail(animal_id: int, db: Session = Depends(database.get_db)):
    animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if not animal: raise HTTPException(status_code=404, detail="Animal not found")
    
    animal.views += 1
    db.commit()
    
    seller = animal.seller
    avg = db.query(func.avg(models.Review.rating)).filter(models.Review.reviewee_id == seller.id).scalar() or 0.0
    count = db.query(models.Review).filter(models.Review.reviewee_id == seller.id).count()
    
    seller_dict = {**seller.__dict__, "average_rating": avg, "review_count": count}
    return {**animal.__dict__, "seller": seller_dict, "images": animal.images}

@app.get("/users/me/animals", response_model=List[schemas.AnimalOut])
def get_my_animals(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    return db.query(models.Animal).filter(models.Animal.seller_id == current_user.id).order_by(models.Animal.created_at.desc()).all()

@app.delete("/animals/{animal_id}")
def delete_animal(animal_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if not animal: raise HTTPException(status_code=404, detail="Not found")
    if animal.seller_id != current_user.id: raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(animal)
    db.commit()
    return {"message": "Deleted"}

# --- FAVORITES ---

@app.post("/animals/{animal_id}/favorite")
def toggle_favorite(animal_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if not animal: raise HTTPException(status_code=404, detail="Animal not found")
    
    if animal in current_user.favorited_animals:
        current_user.favorited_animals.remove(animal)
        msg = "Removed from favorites"
    else:
        current_user.favorited_animals.append(animal)
        msg = "Added to favorites"
    db.commit()
    return {"message": msg}

@app.get("/users/me/favorites", response_model=List[schemas.AnimalOut])
def get_favorites(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    results = []
    for a in current_user.favorited_animals:
        seller = a.seller
        avg = db.query(func.avg(models.Review.rating)).filter(models.Review.reviewee_id == seller.id).scalar() or 0.0
        count = db.query(models.Review).filter(models.Review.reviewee_id == seller.id).count()
        seller_dict = {**seller.__dict__, "average_rating": avg, "review_count": count}
        results.append({**a.__dict__, "seller": seller_dict, "images": a.images})
    return results


# --- CHAT & REVIEWS ---

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(websocket, user_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id)

@app.post("/messages/", response_model=schemas.MessageOut)
async def send_message(msg: schemas.MessageCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    new_msg = models.Message(sender_id=current_user.id, receiver_id=msg.receiver_id, content=msg.content)
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    await manager.send_personal_message(f"NEW_MESSAGE:{current_user.id}", msg.receiver_id)
    return new_msg

@app.get("/messages/contacts", response_model=List[schemas.ChatContact])
def get_chat_contacts(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    sent_ids = db.query(models.Message.receiver_id).filter(models.Message.sender_id == current_user.id)
    received_ids = db.query(models.Message.sender_id).filter(models.Message.receiver_id == current_user.id)
    contact_ids = set([r[0] for r in sent_ids] + [r[0] for r in received_ids])
    
    contacts = []
    for uid in contact_ids:
        user = db.query(models.User).filter(models.User.id == uid).first()
        if user:
            last_msg = db.query(models.Message).filter(
                or_((models.Message.sender_id == current_user.id) & (models.Message.receiver_id == uid),
                    (models.Message.sender_id == uid) & (models.Message.receiver_id == current_user.id))
            ).order_by(models.Message.timestamp.desc()).first()
            contacts.append({"user_id": user.id, "name": user.name, "image": user.profile_image, "last_message": last_msg.content if last_msg else ""})
    return contacts

@app.get("/messages/{other_user_id}", response_model=List[schemas.MessageOut])
def get_chat_history(other_user_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    messages = db.query(models.Message).filter(
        or_((models.Message.sender_id == current_user.id) & (models.Message.receiver_id == other_user_id),
            (models.Message.sender_id == other_user_id) & (models.Message.receiver_id == current_user.id))
    ).order_by(models.Message.timestamp.asc()).all()

    # Mark as read
    unread_messages = db.query(models.Message).filter(
        models.Message.sender_id == other_user_id,
        models.Message.receiver_id == current_user.id,
        models.Message.is_read == False
    ).all()
    if unread_messages:
        for m in unread_messages: m.is_read = True
        db.commit()
    return messages

@app.get("/notifications/unread-count")
def get_unread_count(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    count = db.query(models.Message).filter(models.Message.receiver_id == current_user.id, models.Message.is_read == False).count()
    return {"count": count}

@app.post("/reviews/", response_model=schemas.ReviewOut)
def create_review(review: schemas.ReviewCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    if review.reviewee_id == current_user.id: raise HTTPException(status_code=400, detail="Cannot review yourself")
    new_review = models.Review(reviewer_id=current_user.id, reviewee_id=review.reviewee_id, rating=review.rating, comment=review.comment)
    db.add(new_review)
    db.commit()
    return {"id": new_review.id, "reviewer_name": current_user.name, "rating": new_review.rating, "comment": new_review.comment, "created_at": new_review.created_at}

@app.get("/users/{user_id}/reviews", response_model=List[schemas.ReviewOut])
def get_user_reviews(user_id: int, db: Session = Depends(database.get_db)):
    reviews = db.query(models.Review).filter(models.Review.reviewee_id == user_id).order_by(models.Review.created_at.desc()).all()
    results = []
    for r in reviews:
        reviewer = db.query(models.User).filter(models.User.id == r.reviewer_id).first()
        results.append({"id": r.id, "reviewer_name": reviewer.name if reviewer else "Unknown", "rating": r.rating, "comment": r.comment, "created_at": r.created_at})
    return results

@app.post("/predict-price/")
def get_price_prediction(weight: float = Form(...), age: str = Form(...), breed: str = Form(...), color: str = Form(...)):
    estimated_price = predict_animal_price(weight, age, breed, color)
    return {"estimated_price": estimated_price}



@app.get("/users/me", response_model=schemas.UserProfile)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# 2. Update User Details (Name, Gender, Address)
@app.put("/users/me", response_model=schemas.UserProfile)
def update_user_details(
    data: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    current_user.name = data.name
    current_user.gender = data.gender
    current_user.address = data.address
    db.commit()
    db.refresh(current_user)
    return current_user


@app.get("/users/me", response_model=schemas.UserProfile)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# 2. Update User Details (Name, Gender, Address)
@app.put("/users/me", response_model=schemas.UserProfile)
def update_user_details(
    data: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    current_user.name = data.name
    current_user.gender = data.gender
    current_user.address = data.address
    db.commit()
    db.refresh(current_user)
    return current_user