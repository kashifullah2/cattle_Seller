from database import engine
from models import Base

print("Dropping old tables...")
Base.metadata.drop_all(bind=engine)

# 2. Create new tables (with the correct 'hashed_password' column)
print("Creating new tables...")
Base.metadata.create_all(bind=engine)

print("Database reset successfully! You can now run the server.")