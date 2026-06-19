"""
Run once to create the initial admin user:
    cd backend
    python -m app.seed
"""
from passlib.context import CryptContext
from app.database import supabase

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_admin():
    email = "admin@qaswafoundation.org"
    password = "change-this-password"

    existing = supabase.table("admin_users").select("id").eq("email", email).execute()
    if existing.data:
        print(f"Admin user {email} already exists.")
        return

    hashed = pwd_context.hash(password)
    supabase.table("admin_users").insert(
        {
            "email": email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "superadmin",
        }
    ).execute()
    print(f"Admin user created: {email}")
    print("IMPORTANT: Change the password after first login!")


if __name__ == "__main__":
    seed_admin()
