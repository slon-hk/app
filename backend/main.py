from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# Создаем таблицы в БД при запуске
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="GrooveSync API")

@app.get("/home", response_model=schemas.HomeDataResponse)
def get_home_data(db: Session = Depends(get_db)):
    # Собираем данные из всех таблиц одновременно
    hero_drops = db.query(models.HeroDrop).all()
    featured_editions = db.query(models.FeaturedEdition).all()
    shops = db.query(models.Shop).all()
    threads = db.query(models.Thread).all()
    records = db.query(models.DiscoveryRecord).all()

    # Формируем ответ согласно твоей схеме HomeDataResponse
    return {
        "hero_drop": hero_drops,
        "featured_edition": featured_editions,
        "nearby_shops": shops,
        "active_threads": threads,
        "discovery_filters": ["ALL DIGS", "TECHNO", "JAZZ", "PHONK"], # Можно тоже вынести в БД
        "discovery_records": records
    }

# Добавим эндпоинт для добавления магазина (чтобы потестить БД)
@app.post("/shops", response_model=schemas.Shop)
def create_shop(shop: schemas.Shop, db: Session = Depends(get_db)):
    db_shop = models.Shop(**shop.dict())
    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    return db_shop