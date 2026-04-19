from sqlalchemy import Column, Integer, String, JSON, DateTime
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Integer, default=1)

class HeroDrop(Base):
    __tablename__ = "hero_drops"
    id = Column(String, primary_key=True, index=True)
    image_url = Column(String)
    badge_text = Column(String)
    title_line1 = Column(String)
    title_line2 = Column(String)

class FeaturedEdition(Base):
    __tablename__ = "featured_editions"
    id = Column(String, primary_key=True, index=True)
    edition_label = Column(String)
    description = Column(String)
    price = Column(String)

class Shop(Base):
    __tablename__ = "shops"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    specialty = Column(String)
    distance = Column(String)
    description = Column(String)
    tags = Column(JSON)  # Список строк
    image_url = Column(String)
    coordinates = Column(JSON)  # Объект с lat/lng

class Thread(Base):
    __tablename__ = "threads"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    replies_count = Column(Integer)
    rating = Column(Integer)
    border_color = Column(String)

class DiscoveryRecord(Base):
    __tablename__ = "discovery_records"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    subtitle = Column(String)
    price = Column(String)
    image_url = Column(String)
    badge_text = Column(String)
    badge_color = Column(String)