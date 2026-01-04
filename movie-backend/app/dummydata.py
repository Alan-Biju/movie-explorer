from .database import db
from .data import movie_data


async def get_or_create(collection, name):
    item = await collection.find_one({"name": name})
    if item:
        return item["_id"]

    result = await collection.insert_one({"name": name})
    return result.inserted_id


async def seed_from_data():
    await db.movies.delete_many({})
    await db.actors.delete_many({})
    await db.directors.delete_many({})
    await db.genres.delete_many({})

    for movie in movie_data["movies"]:
        director_id = await get_or_create(
            db.directors, movie["director"]
        )

        actor_ids = [
            await get_or_create(db.actors, actor)
            for actor in movie["actors"]
        ]

        genre_ids = [
            await get_or_create(db.genres, genre)
            for genre in movie["genres"]
        ]

        await db.movies.insert_one({
            "title": movie["title"],
            "year": movie["year"],
            "rating": movie["rating"],
            "director_id": director_id,
            "actor_ids": actor_ids,
            "genre_ids": genre_ids,
            "image": movie.get("image")
        })
