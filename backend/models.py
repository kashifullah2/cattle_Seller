from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# Association Table for Favorites
# extend_existing=True prevents "Table already defined" errors during auto-reload
favorites = Table(
    'favorites', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('animal_id', Integer, ForeignKey('animals.id')),
    extend_existing=True 
)

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True} 

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    gender = Column(String(10), nullable=True)
    address = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False)
    profile_image = Column(String(255), nullable=True)
    
    # For Password Reset
    reset_token = Column(String(100), nullable=True)
    
    # Relationships
    animals = relationship("Animal", back_populates="seller")
    favorited_animals = relationship("Animal", secondary=favorites, back_populates="favorited_by")
    
    # Chat Relationships
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")
    
    # Review Relationships
    reviews_received = relationship("Review", foreign_keys="Review.reviewee_id", back_populates="reviewee")
    reviews_given = relationship("Review", foreign_keys="Review.reviewer_id", back_populates="reviewer")

class Animal(Base):
    __tablename__ = "animals"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100), nullable=True)
    animal_type = Column(String(50), index=True)
    breed = Column(String(100))
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
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    animal_id = Column(Integer, ForeignKey("animals.id"))
    image_url = Column(String(255))
    animal = relationship("Animal", back_populates="images")

class Message(Base):
    __tablename__ = "messages"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False) # Used for Notification Bell
    
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")

class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    reviewee_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews_given")
    reviewee = relationship("User", foreign_keys=[reviewee_id], back_populates="reviews_received")