import uuid
from database import SessionLocal, engine
import models

# Создаем таблицы, если их еще нет
models.Base.metadata.create_all(bind=engine)


def _id() -> str:
    return str(uuid.uuid4())


def seed_initial_data() -> None:
    db = SessionLocal()
    try:
        if db.query(models.HeroDrop).first():
            return

        hero_drops = [
            models.HeroDrop(
                id=_id(),
                image_url="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
                badge_text="NEW",
                title_line1="Tomorrow's hottest",
                title_line2="Drop"
            ),
        ]

        featured_editions = [
            models.FeaturedEdition(
                id=_id(),
                edition_label="LIMITED",
                description="Final pressing from the 90s vinyl line.",
                price="$42"
            ),
            models.FeaturedEdition(
                id=_id(),
                edition_label="DIGITAL",
                description="Exclusive digital edition with bonus tracks.",
                price="$12"
            ),
        ]

        shops = [
            models.Shop(
                id=_id(),
                name="Vinyl Vault",
                specialty="Rare records",
                distance="1.2 km",
                description="Подвинься к лучшей коллекции в городе.",
                tags=["VINTAGE", "HIP-HOP", "TECHNO"],
                image_url="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop",
                coordinates={"latitude": 40.7128, "longitude": -74.0060}
            ),
            models.Shop(
                id=_id(),
                name="Record Room",
                specialty="New drops",
                distance="2.4 km",
                description="Локальная точка для тех, кто ищет свежие релизы.",
                tags=["NEW", "ELECTRONIC", "JAZZ"],
                image_url="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",
                coordinates={"latitude": 40.73061, "longitude": -73.935242}
            ),
        ]

        threads = [
            models.Thread(
                id=_id(),
                title="Best underground techno labels",
                replies_count=24,
                rating=5,
                border_color="#FF5A5F"
            ),
            models.Thread(
                id=_id(),
                title="Summer crate digging tips",
                replies_count=11,
                rating=4,
                border_color="#00A699"
            ),
        ]

        discovery_records = [
            models.DiscoveryRecord(
                id=_id(),
                title="Analog Dreams",
                subtitle="Limited cassette",
                price="$18",
                image_url="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
                badge_text="HOT",
                badge_color="#FF8C00"
            ),
            models.DiscoveryRecord(
                id=_id(),
                title="Neon Nights",
                subtitle="Vinyl EP",
                price="$24",
                image_url="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",
                badge_text="NEW",
                badge_color="#4CAF50"
            ),
        ]

        db.add_all(hero_drops + featured_editions + shops + threads + discovery_records)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_initial_data()
