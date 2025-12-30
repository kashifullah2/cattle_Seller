from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

favorites = Table(
    'favorites', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('animal_id', Integer, ForeignKey('animals.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False)
    
    # --- NEW: Profile Image ---
    profile_image = Column(String(255), nullable=True)
    # --------------------------

    animals = relationship("Animal", back_populates="seller")
    favorited_animals = relationship("Animal", secondary=favorites, back_populates="favorited_by")

class Animal(Base):
    __tablename__ = "animals"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"))
    
    animal_type = Column(String(50), index=True)
    price = Column(Float, index=True)
    weight = Column(Float)
    color = Column(String(50))
    city = Column(String(100), index=True)
    description = Column(Text)
    views = Column(Integer, default=0)
    is_sold = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    seller = relationship("User", back_populates="animals")
    images = relationship("AnimalImage", back_populates="animal", cascade="all, delete-orphan")
    favorited_by = relationship("User", secondary=favorites, back_populates="favorited_animals")

class AnimalImage(Base):
    __tablename__ = "animal_images"

    id = Column(Integer, primary_key=True, index=True)
    animal_id = Column(Integer, ForeignKey("animals.id"))
    image_url = Column(String(255))
    
    animal = relationship("Animal", back_populates="images")