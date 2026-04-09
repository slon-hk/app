import json
from database import SessionLocal, engine
import models

# Создаем таблицы, если их еще нет
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    with open("/Users/slon_hk/Documents/Projects/mobapp/frontend/undeground/data/test_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Загружаем Hero Drops
    for item in data.get("hero_drop", []):
        db.add(models.HeroDrop(**item))

    # 2. Загружаем Featured Editions
    for item in data.get("featured_edition", []):
        db.add(models.FeaturedEdition(**item))

    # 3. Загружаем Shops
    for item in data.get("nearby_shops", []):
        db.add(models.Shop(**item))

    # 4. Загружаем Threads
    for item in data.get("active_threads", []):
        db.add(models.Thread(**item))

    # 5. Загружаем Discovery Records
    for item in data.get("discovery_records", []):
        db.add(models.DiscoveryRecord(**item))

    db.commit()
    db.close()
    print("✅ База данных успешно наполнена данными из JSON!")

if __name__ == "__main__":
    seed_data()