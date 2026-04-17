from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Validate env
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment variables")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

# ✅ CORS middleware (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class Note(BaseModel):
    content: str


# Health check
@app.get("/")
def root():
    return {"message": "API is running"}


# Get all notes
@app.get("/notes")
def get_notes():
    response = supabase.table("notes").select("*").execute()
    return response.data


# Add new note
@app.post("/notes")
def add_note(note: Note):
    response = supabase.table("notes").insert({
        "content": note.content
    }).execute()
    return response.data