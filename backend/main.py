import json
import os
from datetime import datetime, timezone, timedelta
from typing import Optional
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import engine, get_db, Base
from models import User, Post, Event, EventParticipant, Spotted

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kindred Pulse API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic schemas ---

class UserOut(BaseModel):
    id: int
    username: str
    display_name: str
    role: str
    avatar_url: str
    location: str
    bio: str
    interests: list[str]
    fun_facts: list[str]

    class Config:
        from_attributes = True


class PostOut(BaseModel):
    id: int
    content: str
    image_url: str
    post_type: str
    reactions: dict
    created_at: datetime
    author: UserOut

    class Config:
        from_attributes = True


class SpottedOut(BaseModel):
    id: int
    title: str
    image_url: str
    location: str
    created_at: datetime
    author: UserOut

    class Config:
        from_attributes = True


class EventOut(BaseModel):
    id: int
    title: str
    description: str
    event_type: str
    location: str
    vibe: str
    starts_at: datetime
    capacity: int
    image_url: str
    created_at: datetime
    creator: UserOut
    participant_count: int
    participants: list[UserOut]

    class Config:
        from_attributes = True


class EventCreate(BaseModel):
    title: str
    description: str = ""
    event_type: str = "coffee"
    location: str = ""
    vibe: str = "Chill & Chat"
    starts_at: Optional[str] = None
    capacity: int = 8


class PostCreate(BaseModel):
    content: str
    image_url: str = ""
    post_type: str = "story"


class ReactionUpdate(BaseModel):
    emoji: str


# --- Helpers ---

def serialize_user(u: User) -> dict:
    return {
        "id": u.id,
        "username": u.username,
        "display_name": u.display_name,
        "role": u.role,
        "avatar_url": u.avatar_url,
        "location": u.location,
        "bio": u.bio,
        "interests": json.loads(u.interests) if u.interests else [],
        "fun_facts": json.loads(u.fun_facts) if u.fun_facts else [],
    }


def serialize_post(p: Post) -> dict:
    return {
        "id": p.id,
        "content": p.content,
        "image_url": p.image_url,
        "post_type": p.post_type,
        "reactions": json.loads(p.reactions) if p.reactions else {},
        "created_at": p.created_at.isoformat(),
        "author": serialize_user(p.author),
    }


def serialize_spotted(s: Spotted) -> dict:
    return {
        "id": s.id,
        "title": s.title,
        "image_url": s.image_url,
        "location": s.location,
        "created_at": s.created_at.isoformat(),
        "author": serialize_user(s.author),
    }


def serialize_event(e: Event) -> dict:
    return {
        "id": e.id,
        "title": e.title,
        "description": e.description,
        "event_type": e.event_type,
        "location": e.location,
        "vibe": e.vibe,
        "starts_at": e.starts_at.isoformat(),
        "capacity": e.capacity,
        "image_url": e.image_url,
        "created_at": e.created_at.isoformat(),
        "creator": serialize_user(e.creator),
        "participant_count": len(e.participants),
        "participants": [serialize_user(p.user) for p in e.participants],
    }


# --- Seed data ---

@app.on_event("startup")
def seed_data():
    db = next(get_db())
    if db.query(User).count() > 0:
        db.close()
        return

    users = [
        User(
            username="alex_rivera",
            display_name="Alex Rivera",
            role="Design Team & Happiness Officer",
            avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuCVNyrL6UkatX2-8MxDFSLtkcEHX8LnklmFtht1nmcnsDR6HCnXyRPWTMaE7yZlWg90xcey-PT6qkuFHGKgh5X4oQWOLrpixyKIiRecQcUV7bEQy_U9PRiQhalhU1YO1jKqZMIXsI3uzQ2rj-xm66vuFdQOfAooStBb2L27e9_QCadnH7zyvJu8agpdKpabmkMRjnYum_5W87mK9A3w-kV_s_rOtXccQj4jFEQrOFKMVMD9MgSi5jXWeeC7Hj5rUGfZQTE3AmaCIXM",
            location="Austin Hub",
            bio="Helping everyone find their rhythm. I believe community is built one cup of coffee and one retro game match at a time.",
            interests=json.dumps(["Coffee", "Retro Gaming", "Padel", "Sci-Fi"]),
            fun_facts=json.dumps(["Owns 37 succulents (and they all have names)", "Secretly a DJ on weekends as 'The Vector'"]),
        ),
        User(
            username="jade_rivers",
            display_name="Jade Rivers",
            role="Design Lead",
            avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuA0p1-GvrB5NaxvV8if0KjEtGgv_1_sAso-JPr3Af0OcCLW_LQfgq5qbrEXY1AQbPxBSFqNYQ8pr6l5rFkZkGlVjFh5ekZ8QaMAajBdGwaC842GzbiCOx_uxU4eMjAiH57h9i2y_zAj5vOHu3lWYaOroN5a5Q4GFMo-LC1dq7y5OpnPSFUoEpynrkdnhy2fBXhp8vbEPlAgSm8COA3AdXNXr0UPJvwmMiDCc0ClzNsiAl8_iYIoXqOjg_5jWOShVJZoKzxn7JEFWKw",
            location="Portland Office",
            bio="Designing warm, human experiences.",
            interests=json.dumps(["Design Systems", "Typography", "Illustration"]),
            fun_facts=json.dumps(["Can identify any font in under 5 seconds"]),
        ),
        User(
            username="marco_chen",
            display_name="Marco Chen",
            role="Senior Developer",
            avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuDiUgHHwodt34csnm1jeN0jF7irTb2CovoTOHTVJRW2g8VbibI4EeZUulJRWBkY-uzQ4XPDGo_nbaOhB-MbocvdSypYHTurDf2lmLImIL5LU_XwAy_NEImOzA4z_FCrQrBVCjmChfqV7UYOGcNYfB933I2GGUuRf-tHHDPKOwiP6Ra8D4Y8ElIboEaBJeFbOwLylgTFGyjogaQhBCMX4DdCq8iPt4wgbftW1G8MvOGNlM-jdfwMwktYiv1rYVCAUC3TvUR_dtcjces",
            location="Remote",
            bio="Clean code enthusiast. The code is like a living room.",
            interests=json.dumps(["Clean Code", "Architecture", "Coffee"]),
            fun_facts=json.dumps(["Has 100+ mechanical keyboards"]),
        ),
        User(
            username="bella_thorne",
            display_name="Bella Thorne",
            role="Social Manager",
            avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuAyy0nHdEvZ5OSMgcJPKInrx2sTQnhYjoUI5453YS-gtxnU5dsLBeGAAgKlVs5D7tNYFxQrZp2dPtyzvJdoF9TJd1JWFEt7KuFMZMfXqATVnlfd_mKTU7c4M4lPE8Nbmrtv5I2gzbAC6ReYm1JkYUOHUSVXJ6BDZs8aL56wHgWRpiAnAWluWJbOP7Dfi7MHZHA3sGCMQKRe1OR7nJbV7kA8FePG9zKMNgaZ3EU33sQMna5ui1Fair4kDbUJ51vs6aXxGBMeuwOOoCU",
            location="NYC Hub",
            bio="Bringing people together, one event at a time.",
            interests=json.dumps(["Events", "Photography", "Travel"]),
            fun_facts=json.dumps(["Organized 200+ company events last year"]),
        ),
        User(
            username="sarah_ops",
            display_name="Sarah from Design",
            role="Operations & Design",
            avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuA8RbQa-lxwJWnHcRhVW2cogf8rsxzlWwcp0lrQzu6h6i6YHX5Dwk6qO8TMTC7R3UKi4A0fYSsUV2ek3SXPCtuvRr7J4ajUFHcBa_Ypab4opliVXmlwD-b1_xm9n9eDuME9tReH-w8o_q3bsGmXZrKGzDwUTsxD4b831YeyfQ26-6_esEax-h80HN32-Zzbb6egL5iI3T0g2tyY8xHzF9uxGT-7e0n_2k7jW3pS3jY_EIDfLc8X4vmv4VWm5Zy5DbjFX0Z6uIcJh4k",
            location="Main Office",
            bio="Making the workplace feel like home.",
            interests=json.dumps(["Interior Design", "Coffee", "Plants"]),
            fun_facts=json.dumps(["Office plant whisperer"]),
        ),
    ]
    db.add_all(users)
    db.commit()

    for u in users:
        db.refresh(u)

    posts = [
        Post(
            author_id=users[1].id,
            content="Just finished the new design system workshop! Thanks to everyone who participated. The radiant vibes are definitely coming through. Can't wait to see how we build this out! ✨",
            image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuAfkYa7-6VY9-wkaYLL9vEVQz9CumMPtqXYezg9WwRaSSXeB2A4ceNUKSKAwm7HZpE4uVdP3W8z0r7HDXTKpipJKyTV6zVLHNzGJzHTlyaNzTuT440JrvaPVHy0kypwgYMp583Os2ekWXtUZqDr_0HrcRhyhTvWrDKk81Mw1lSi0vwV061-sidYA-4D8M_rdkXCSlrpqnoiTpoi-ZicENlghxFZU7iCwCyoujeO2_iGeuTU79r0DLMecIThALl53ueunEkLwTrPwtY",
            post_type="story",
            reactions=json.dumps({"☕": 12, "🔥": 24, "😂": 5, "👀": 8, "🎯": 3}),
        ),
        Post(
            author_id=users[2].id,
            content='"The code is like a living room. If it\'s messy, nobody wants to stay. If it\'s clean and warm, everyone wants to contribute."',
            post_type="quote",
            reactions=json.dumps({"🔥": 56, "🎯": 31, "☕": 14}),
        ),
        Post(
            author_id=users[3].id,
            content="Who's up for some after-office drinks at the rooftop bar today? First round of ☕ (or stronger) is on the social club! 🍹",
            image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuD1_mhDahk3g-B0u9b4GMqdOVSkxQakkfnO0BPsoS_UgoCRoXbWim4yEL8dz-4iLrLG38X3OuCeRhL6KULVvYDmBemwrF_Hj2bV_egBCp2iSrjInPvX8QUOYw7hvP0tONKR808b9-8hj7TUOcSQGVLytf52cq740UirUuMO8flfbNdBGEMFF7Uqy9lwvID-65knjsWSAJZHGjOAQbltXONh4yr4cxsuaJmaaHcfuT5F7bji5mpN-XAx0dTfcMHfDXeVxgV_ijLXrt0",
            post_type="story",
            reactions=json.dumps({"🔥": 89, "👀": 42}),
        ),
        Post(
            author_id=users[4].id,
            content="Zrobiłem apkę w 1h. Dlaczego wy wyceniacie to na 3 miesiące",
            image_url="/meme.jpeg",
            post_type="meme",
            reactions=json.dumps({"😂": 128, "🔥": 64, "☕": 42}),
        ),
    ]
    db.add_all(posts)

    spotted_items = [
        Spotted(author_id=users[0].id, title="Kuba sleeping", image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuCRYzjh768FDLKo_cZZI3iLWNXeAiju7vOUVwHiuqQz07AjqTto9aRGH9zUvdjoTb4x3KW_7lB8tOhZtY44qtYAq2GJ7Am-Fnsmq3i5KIVPmkpRbUyX7caXnhLN0A0hwx4mVELYLEEN291a3q7iT2A3yDSeMzPtRO3YDlh6qmNntVHdqWfiOZr1U5L1D1aaAhW1CtfrXeLhkfBFJSVrrGd5p1ocLAoAdd6Yzbg_6D4HpdzjsBMJl3Om8GURZ9SQb9ExAHJS5TktZgk", location="Lounge"),
        Spotted(author_id=users[1].id, title="New plants!", image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuDh5_3U-DJ2wgW4Do2tBzbrb_dKkJvjGT2P1lblFqiA84M36C8xeXLXUOvR2jc9lWMxxzd1lu9QdVQb9QDt1M_5SROqptgj4cOP6xy9kFPVtJ7DPUdX80Xd8xHqUqfm0VkuSRa7H0HM_N1Y9UiuqCt89z5-ADok7QYty6VM9GcqEzMz5eSy7YXbGELjyMvh_erCDeeuV64ihS1_6hRIEunUGgLtS55y8jkR4Hp_WEJncCG3qj90u9P6KMvchaEQEqbqgFqIfqkG0JE", location="Reception"),
        Spotted(author_id=users[3].id, title="Cake Alert 🎂", image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuCqRZ7mLINbB2qNJ4nJA9HVFtg_Vjp51SAHBS4Mate3Jkt01VcdtKiiIiSW1iaHzX2ysqwoseiEANQ97MVJhBZsJ-D3v1SnYlfOtTXmZ3jOeUJOKKOiN8CR6kGAGUECMdVEVaDI6KYlQIXcN_WmbNPMX2bj1awhb1uxTeJ2rlEGW4fyUiTqqRR7qjlbKEBAVSt4DDODT80ynP_-LT1sPgqalO8ZduBUh82rnSpUz-Fh8oLoeOLcUA7eMkj3JNKs520jp14yQZVWtZg", location="Kitchen"),
    ]
    db.add_all(spotted_items)

    now = datetime.now(timezone.utc)
    events = [
        Event(
            creator_id=users[4].id,
            title="Kuba przy kawomacie",
            description="Kuba zaprasza na kawę i spontaniczną pogawędkę. Bez agendy, same dobre viby.",
            event_type="coffee",
            location="Main Lobby Floor 2",
            vibe="Chill & Chat",
            starts_at=now + timedelta(minutes=5),
            capacity=5,
            image_url="/kuba.jpeg",
        ),
        Event(
            creator_id=users[0].id,
            title="Darts now",
            description="Quick darts round to clear the mind!",
            event_type="darts",
            location="The Attic",
            vibe="High Energy",
            starts_at=now + timedelta(minutes=30),
            capacity=8,
            image_url="",
        ),
        Event(
            creator_id=users[3].id,
            title="Quick Lunch Run",
            description="Meet at Main Lobby for a spontaneous lunch outing.",
            event_type="lunch",
            location="Meet at Main Lobby",
            vibe="Social",
            starts_at=now + timedelta(hours=2),
            capacity=10,
            image_url="",
        ),
    ]
    db.add_all(events)
    db.commit()

    for e in events:
        db.refresh(e)

    participants = [
        EventParticipant(event_id=events[0].id, user_id=users[0].id),
        EventParticipant(event_id=events[0].id, user_id=users[1].id),
        EventParticipant(event_id=events[1].id, user_id=users[2].id),
        EventParticipant(event_id=events[1].id, user_id=users[3].id),
        EventParticipant(event_id=events[2].id, user_id=users[0].id),
        EventParticipant(event_id=events[2].id, user_id=users[1].id),
        EventParticipant(event_id=events[2].id, user_id=users[2].id),
        EventParticipant(event_id=events[2].id, user_id=users[3].id),
        EventParticipant(event_id=events[2].id, user_id=users[4].id),
    ]
    db.add_all(participants)
    db.commit()
    db.close()


# --- API Routes ---

@app.get("/api/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [serialize_user(u) for u in users]


@app.get("/api/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_user(user)


@app.get("/api/feed")
def get_feed(db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.created_at.desc()).all()
    return [serialize_post(p) for p in posts]


@app.get("/api/feed/meme")
def get_meme_of_the_day(db: Session = Depends(get_db)):
    meme = db.query(Post).filter(Post.post_type == "meme").order_by(Post.created_at.desc()).first()
    if not meme:
        return None
    return serialize_post(meme)


@app.post("/api/feed")
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = Post(author_id=1, content=post.content, image_url=post.image_url, post_type=post.post_type)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return serialize_post(db_post)


@app.post("/api/feed/{post_id}/react")
def react_to_post(post_id: int, reaction: ReactionUpdate, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    reactions = json.loads(post.reactions) if post.reactions else {}
    reactions[reaction.emoji] = reactions.get(reaction.emoji, 0) + 1
    post.reactions = json.dumps(reactions)
    db.commit()
    return serialize_post(post)


@app.get("/api/spotted")
def get_spotted(db: Session = Depends(get_db)):
    items = db.query(Spotted).order_by(Spotted.created_at.desc()).all()
    return [serialize_spotted(s) for s in items]


@app.get("/api/events")
def list_events(db: Session = Depends(get_db)):
    events = db.query(Event).order_by(Event.starts_at.asc()).all()
    return [serialize_event(e) for e in events]


@app.get("/api/events/{event_id}")
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return serialize_event(event)


@app.post("/api/events")
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    starts_at = datetime.now(timezone.utc) + timedelta(minutes=30)
    if event.starts_at:
        try:
            starts_at = datetime.fromisoformat(event.starts_at)
        except ValueError:
            pass
    db_event = Event(
        creator_id=1,
        title=event.title,
        description=event.description,
        event_type=event.event_type,
        location=event.location,
        vibe=event.vibe,
        starts_at=starts_at,
        capacity=event.capacity,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return serialize_event(db_event)


@app.post("/api/events/{event_id}/join")
def join_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if len(event.participants) >= event.capacity:
        raise HTTPException(status_code=400, detail="Event is full")
    existing = db.query(EventParticipant).filter(
        EventParticipant.event_id == event_id,
        EventParticipant.user_id == 1,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already joined")
    participant = EventParticipant(event_id=event_id, user_id=1)
    db.add(participant)
    db.commit()
    db.refresh(event)
    return serialize_event(event)


@app.get("/api/users/{user_id}/activity")
def get_user_activity(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    posts = db.query(Post).filter(Post.author_id == user_id).order_by(Post.created_at.desc()).all()
    spotted = db.query(Spotted).filter(Spotted.author_id == user_id).order_by(Spotted.created_at.desc()).all()
    return {
        "posts": [serialize_post(p) for p in posts],
        "spotted": [serialize_spotted(s) for s in spotted],
    }


# --- Serve frontend static files (for single-container deployment) ---

static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(static_dir / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = static_dir / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(static_dir / "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
