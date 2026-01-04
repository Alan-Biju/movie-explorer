from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId

from .database import db
from .dummydata import seed_from_data

app = FastAPI(title="Movie API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def startup_event():
    await seed_from_data()

@app.get("/movies")
async def list_movies(
    title = None,
    actor_id = None,
    genre_id = None,
    director_id = None,
    page: int = 1,
    limit: int = 6,
):
    query = {}

    if title:
        query["title"] = {
            "$regex": title,
            "$options": "i"
        }

    if actor_id:
        query["actor_ids"] = ObjectId(actor_id)

    if genre_id:
        query["genre_ids"] = ObjectId(genre_id)

    if director_id:
        query["director_id"] = ObjectId(director_id)

    page = max(page, 1)
    limit = min(max(limit, 1), 50)
    skip = (page - 1) * limit

    total = await db.movies.count_documents(query)

    movies = (
        await db.movies
        .find(query)
        .skip(skip)
        .limit(limit)
        .to_list(limit)
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": [
            {
                "id": str(m["_id"]),
                "title": m["title"],
                "year": m["year"],
                "rating": m["rating"],
                "director_id": str(m["director_id"]),
                "actor_ids": [str(a) for a in m["actor_ids"]],
                "genre_ids": [str(g) for g in m["genre_ids"]],
                "image": m.get("image"),
            }
            for m in movies
        ],
    }

@app.get("/movies/{movie_id}")
async def movie_details(movie_id):
    movie = await db.movies.find_one({"_id": ObjectId(movie_id)})
    if not movie:
        return {"error": "Movie not found"}

    director = await db.directors.find_one(
        {"_id": movie["director_id"]}
    )

    actors = await db.actors.find(
        {"_id": {"$in": movie["actor_ids"]}}
    ).to_list(20)

    genres = await db.genres.find(
        {"_id": {"$in": movie["genre_ids"]}}
    ).to_list(20)

    return {
        "id": str(movie["_id"]),
        "title": movie["title"],
        "year": movie["year"],
        "rating": movie["rating"],
        "image": movie.get("image"),
        "director": {
            "id": str(director["_id"]),
            "name": director["name"]
        } if director else None,
        "actors": [
            {"id": str(a["_id"]), "name": a["name"]}
            for a in actors
        ],
        "genres": [
            {"id": str(g["_id"]), "name": g["name"]}
            for g in genres
        ],
    }


@app.get("/actors")
async def list_actors():
    actors = await db.actors.find().to_list(100)
    return [{"id": str(a["_id"]), "name": a["name"]} for a in actors]


@app.get("/genres")
async def list_genres():
    genres = await db.genres.find().to_list(100)
    return [{"id": str(g["_id"]), "name": g["name"]} for g in genres]


@app.get("/directors")
async def list_directors():
    directors = await db.directors.find().to_list(100)
    return [{"id": str(d["_id"]), "name": d["name"]} for d in directors]
