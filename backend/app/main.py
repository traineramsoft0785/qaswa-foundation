from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import auth, programs, gallery, notices, donations, contacts, upload, dashboard

app = FastAPI(title="The Qaswa Foundation API", version="1.0.0")

origins = [settings.frontend_url]
if settings.environment == "development":
    origins.append("http://localhost:5173")
    origins.append("http://localhost:5174")
    origins.append("http://localhost:5175")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(programs.router)
app.include_router(gallery.router)
app.include_router(notices.router)
app.include_router(donations.router)
app.include_router(contacts.router)
app.include_router(upload.router)
app.include_router(dashboard.router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
