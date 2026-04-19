from pydantic import BaseModel, HttpUrl, EmailStr
from typing import List, Optional
from datetime import datetime

# --- Аутентификация ---

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime
    is_active: int
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# --- Вспомогательные модели ---

class Coordinates(BaseModel):
    latitude: float
    longitude: float
    class Config:
        from_attributes = True
# --- Основные модели контента ---

class HeroDrop(BaseModel):
    id: str
    image_url: str
    badge_text: str
    title_line1: str
    title_line2: str
    class Config:
        from_attributes = True

class FeaturedEdition(BaseModel):
    id: str
    edition_label: str
    description: str
    price: str
    class Config:
        from_attributes = True

class ShopCreate(BaseModel):
    name: str
    specialty: str
    distance: str
    description: str
    tags: List[str]
    image_url: str
    coordinates: Coordinates

class Shop(BaseModel):
    id: str
    name: str
    specialty: str
    distance: str
    description: str
    tags: List[str]
    image_url: str
    coordinates: Coordinates
    class Config:
        from_attributes = True

class Thread(BaseModel):
    id: str
    title: str
    replies_count: int
    rating: int
    border_color: str
    class Config:
        from_attributes = True

class DiscoveryRecord(BaseModel):
    id: str
    title: str
    subtitle: str
    price: str
    image_url: str
    badge_text: str
    badge_color: str
    class Config:
        from_attributes = True

# --- Корневая модель ответа для HomeScreen ---
class HomeDataResponse(BaseModel):
    hero_drop: List[HeroDrop]
    featured_edition: List[FeaturedEdition]
    nearby_shops: List[Shop]
    active_threads: List[Thread]
    discovery_filters: List[str]
    discovery_records: List[DiscoveryRecord]
    class Config:
        from_attributes = True