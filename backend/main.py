from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

import models
import schemas
from database import engine, get_db
from auth import hash_password, verify_password, create_access_token, decode_access_token
from seed import seed_initial_data

models.Base.metadata.create_all(bind=engine)
seed_initial_data()

app = FastAPI(title="GrooveSync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/home", response_model=schemas.HomeDataResponse)
def get_home_data(db: Session = Depends(get_db)):
    hero_drops = db.query(models.HeroDrop).all()
    featured_editions = db.query(models.FeaturedEdition).all()
    shops = db.query(models.Shop).all()
    threads = db.query(models.Thread).all()
    records = db.query(models.DiscoveryRecord).all()

    return {
        "hero_drop": hero_drops,
        "featured_edition": featured_editions,
        "nearby_shops": shops,
        "active_threads": threads,
        "discovery_filters": ["ALL DIGS", "TECHNO", "JAZZ", "PHONK"],
        "discovery_records": records
    }

@app.get("/shops", response_model=List[schemas.Shop])
def list_shops(db: Session = Depends(get_db)):
    return db.query(models.Shop).all()

@app.get("/shops/{shop_id}", response_model=schemas.Shop)
def get_shop(shop_id: str, db: Session = Depends(get_db)):
    shop = db.query(models.Shop).filter(models.Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shop not found")
    return shop

@app.get("/threads", response_model=List[schemas.Thread])
def list_threads(db: Session = Depends(get_db)):
    return db.query(models.Thread).all()

@app.get("/discovery", response_model=List[schemas.DiscoveryRecord])
def list_discovery_records(db: Session = Depends(get_db)):
    return db.query(models.DiscoveryRecord).all()

@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@app.post("/shops", response_model=schemas.Shop)
def create_shop(shop: schemas.ShopCreate, db: Session = Depends(get_db)):
    db_shop = models.Shop(id=str(uuid.uuid4()), **shop.dict())
    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    return db_shop

@app.post("/register", response_model=schemas.TokenResponse)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    existing_email = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    existing_username = db.query(models.User).filter(models.User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)

    db_user = models.User(
        id=user_id,
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = create_access_token(data={"sub": db_user.id, "email": db_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@app.post("/login", response_model=schemas.TokenResponse)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(data={"sub": user.id, "email": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/me", response_model=schemas.UserResponse)
def get_current_user(authorization: Optional[str] = Header(None), token: Optional[str] = None, db: Session = Depends(get_db)):
    if not token and authorization:
        auth_value = authorization.split(" ")
        if len(auth_value) == 2 and auth_value[0].lower() == "bearer":
            token = auth_value[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    user_id = payload.get("sub")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user
