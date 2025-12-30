import os
import shutil
from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_
from passlib.context import CryptContext
from jose import JWTError, jwt
from ml_utils import predict_animal_price
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
import models, schemas, database

# --- Configuration ---
SECRET_KEY = "supersecretkey" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 Days

# --- Security Setup ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Ensure tables exist
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Animal Marketplace API")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- Auth Helper Functions ---
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
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        phone: str = payload.get("sub")
        if phone is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.phone == phone).first()
    if user is None:
        raise credentials_exception
    return user

# --- Auth Endpoints ---

@app.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.phone == user.phone).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    hashed_pw = get_password_hash(user.password)
    new_user = models.User(name=user.name, phone=user.phone, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.phone})
    return {"access_token": access_token, "token_type": "bearer", "user_name": new_user.name, "user_id": new_user.id}

@app.post("/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.phone == user_data.phone).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid phone or password")
    
    access_token = create_access_token(data={"sub": user.phone})
    return {"access_token": access_token, "token_type": "bearer", "user_name": user.name, "user_id": user.id}

# --- Animal Endpoints ---

@app.post("/animals/", response_model=schemas.AnimalOut)
def create_animal_listing(
    animal_type: str = Form(...),
    price: float = Form(...),
    weight: float = Form(...),
    color: str = Form(...),
    city: str = Form(...),
    description: str = Form(""),
    files: List[UploadFile] = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    new_animal = models.Animal(
        seller_id=current_user.id,
        animal_type=animal_type,
        price=price,
        weight=weight,
        color=color,
        city=city,
        description=description
    )
    db.add(new_animal)
    db.commit()
    db.refresh(new_animal)

    for file in files:
        file_location = f"static/uploads/{new_animal.id}_{file.filename}"
        with open(file_location, "wb+") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        image_url = f"http://localhost:8000/{file_location}"
        db_image = models.AnimalImage(animal_id=new_animal.id, image_url=image_url)
        db.add(db_image)
    
    db.commit()
    db.refresh(new_animal)
    return new_animal

@app.get("/animals/", response_model=List[schemas.AnimalOut])
def get_animals(
    type: Optional[str] = None,
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Animal)

    if type and type != "All":
        query = query.filter(models.Animal.animal_type == type)
    if city:
        query = query.filter(models.Animal.city.ilike(f"%{city}%"))
    if min_price:
        query = query.filter(models.Animal.price >= min_price)
    if max_price:
        query = query.filter(models.Animal.price <= max_price)
    if search:
        query = query.filter(or_(
            models.Animal.description.ilike(f"%{search}%"),
            models.Animal.animal_type.ilike(f"%{search}%")
        ))

    return query.order_by(models.Animal.created_at.desc()).all()

@app.get("/animals/{animal_id}", response_model=schemas.AnimalOut)
def get_animal_detail(animal_id: int, db: Session = Depends(database.get_db)):
    animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    return animal

# --- DELETE ENDPOINT (NEW) ---
@app.delete("/animals/{animal_id}", status_code=204)
def delete_animal(
    animal_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    
    if animal.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this post")
    
    db.delete(animal)
    db.commit()
    return None



@app.post("/predict-price/")
def get_price_prediction(
    weight: float = Form(...),
    age: str = Form(...),   # Accepting string to handle "2.5 years"
    breed: str = Form(...),
    color: str = Form(...)
):
    # Call the utility function
    estimated_price = predict_animal_price(weight, age, breed, color)
    
    return {"estimated_price": estimated_price}



# ... [Imports remain the same, ensure 'from typing import List' is there] ...
# Add these specific imports if missing:
from sqlalchemy import func, desc

# ... [Keep Auth functions & Setup same as before] ...

# --- 1. Dashboard Endpoint ---
@app.get("/users/me/animals", response_model=List[schemas.AnimalOut])
def get_my_animals(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    """Returns only the ads posted by the logged-in user"""
    return db.query(models.Animal).filter(models.Animal.seller_id == current_user.id).all()

# --- 2. Mark as Sold Endpoint ---
@app.put("/animals/{animal_id}/sold", status_code=200)
def mark_as_sold(
    animal_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if not animal or animal.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    animal.is_sold = True
    db.commit()
    return {"message": "Marked as sold"}

# --- 3. Favorites Endpoints ---
@app.post("/animals/{animal_id}/favorite")
def toggle_favorite(
    animal_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(404, "Animal not found")
    
    if animal in current_user.favorited_animals:
        current_user.favorited_animals.remove(animal)
        msg = "Removed from favorites"
    else:
        current_user.favorited_animals.append(animal)
        msg = "Added to favorites"
    
    db.commit()
    return {"message": msg}

@app.get("/users/me/favorites", response_model=List[schemas.AnimalOut])
def get_my_favorites(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    return current_user.favorited_animals

# --- 4. Increment View Count (Modified GET) ---
@app.get("/animals/{animal_id}", response_model=schemas.AnimalOut)
def get_animal_detail(animal_id: int, db: Session = Depends(database.get_db)):
    animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    
    # Increment view count
    animal.views += 1
    db.commit()
    db.refresh(animal)
    
    return animal

# --- 5. Report Endpoint (Simple implementation) ---
@app.post("/animals/{animal_id}/report")
def report_ad(
    animal_id: int,
    reason: str = Form(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    # In a real app, save to a 'reports' table. Here we just acknowledge it.
    print(f"REPORT: User {current_user.id} reported Animal {animal_id} for: {reason}")
    return {"message": "Report received. Admin will review."}

@app.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.phone == user.phone).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    hashed_pw = get_password_hash(user.password)
    # Default profile image is None
    new_user = models.User(name=user.name, phone=user.phone, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.phone})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_name": new_user.name, 
        "user_id": new_user.id,
        "profile_image": new_user.profile_image
    }

@app.post("/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.phone == user_data.phone).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid phone or password")
    
    access_token = create_access_token(data={"sub": user.phone})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_name": user.name, 
        "user_id": user.id,
        "profile_image": user.profile_image
    }

# --- NEW: USER PROFILE IMAGE ENDPOINT ---
@app.put("/users/me/image")
def update_profile_image(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    # Save file
    file_location = f"static/uploads/user_{current_user.id}_{file.filename}"
    with open(file_location, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    image_url = f"http://localhost:8000/{file_location}"
    
    # Update DB
    current_user.profile_image = image_url
    db.commit()
    
    return {"image_url": image_url}

# --- NEW: CONTACT FORM ENDPOINT ---
@app.post("/contact")
def contact_developer(msg: schemas.ContactMessage):
    # In a real app, you would send an email here.
    # For now, we log it to the console.
    print(f"📩 NEW CONTACT MSG from {msg.name} ({msg.email}): {msg.message}")
    return {"message": "Message sent successfully!"}