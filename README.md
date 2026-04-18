# GameLib — Digital Game Vault
**KBTU Web Development course — Spring 2026**

## What is this?

GameLib is a full-stack app where users track their game collections. You can browse a catalog of games pulled from the Steam API, add them to your personal library, set a play status, and leave reviews.

## Stack

- Angular 21
- Django 6 + Django REST Framework
- SQLite 

## Features

- JWT authentication — register, login, logout
- Game catalog seeded from Steam (titles, descriptions, prices, genres)
- AI-generated summaries based on Steam reviews (TF-IDF)
- Personal library with statuses: Playing, Finished, Planned, Dropped
- User reviews with positive/negative recommendation
- Search by title and filter by genre

## Team

- Yanke Elza
- Sakpanova Madina
- Aitkhoza Ilyas

## Running locally

**Backend**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_games  # pulls data from Steam API
python manage.py runserver
```

**Frontend**
```bash
cd frontend/gamelib
npm install
npm start
```

