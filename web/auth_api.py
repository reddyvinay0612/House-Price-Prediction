"""
Citizen Authentication & Profile Management REST API
Provides secure endpoints for password login, mobile OTP verification, citizen registration,
password recovery, and saved property estimates persistence with SQLite storage.
"""

import os
import sqlite3
import hashlib
import secrets
import time
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, EmailStr, Field

router = APIRouter(prefix="/api/auth", tags=["Citizen Authentication"])

DB_PATH = os.path.join(os.path.dirname(__file__), "bharat_citizen_auth.db")
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "bharat_housing_analytics_secret_2026")
TOKEN_EXPIRY_HOURS = 24

# Active OTP In-Memory Cache: { mobile: { "code": "123456", "expires_at": timestamp } }
ACTIVE_OTPS: Dict[str, Dict[str, Any]] = {}


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Create Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS citizens (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            mobile TEXT UNIQUE NOT NULL,
            state TEXT NOT NULL,
            district TEXT NOT NULL,
            user_type TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'CITIZEN',
            created_at TEXT NOT NULL,
            last_login TEXT NOT NULL
        )
    """)

    # Create Saved Estimates Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS saved_estimates (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            city TEXT NOT NULL,
            locality TEXT NOT NULL,
            total_sqft REAL NOT NULL,
            bhk INTEGER NOT NULL,
            bath INTEGER NOT NULL,
            balcony INTEGER NOT NULL,
            area_type TEXT NOT NULL,
            availability TEXT NOT NULL,
            model_name TEXT NOT NULL,
            predicted_price_lakhs REAL NOT NULL,
            formatted_price TEXT NOT NULL,
            price_per_sqft REAL NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES citizens (id)
        )
    """)

    # Seed Default Demo User if empty
    cursor.execute("SELECT COUNT(*) FROM citizens WHERE email = 'demo@portal.in'")
    if cursor.fetchone()[0] == 0:
        demo_pwd_hash = hash_password("Demo@1234")
        now = datetime.utcnow().isoformat()
        cursor.execute("""
            INSERT INTO citizens (id, full_name, email, mobile, state, district, user_type, password_hash, role, created_at, last_login)
            VALUES ('usr_gov_demo_001', 'Ramesh Kumar Sharma', 'demo@portal.in', '9876543210', 'Karnataka', 'Mysuru (Mysore)', 'Buyer', ?, 'CITIZEN', ?, ?)
        """, (demo_pwd_hash, now, now))

        # Seed demo estimates
        cursor.execute("""
            INSERT INTO saved_estimates (id, user_id, city, locality, total_sqft, bhk, bath, balcony, area_type, availability, model_name, predicted_price_lakhs, formatted_price, price_per_sqft, created_at)
            VALUES 
            ('est_2026_001', 'usr_gov_demo_001', 'Mysuru (Mysore)', 'Gokulam', 1450, 3, 3, 2, 'Super built-up  Area', 'Ready To Move', 'Gradient Boosting Regressor', 78.50, '₹78.50 Lakh', 5413, ?),
            ('est_2026_002', 'usr_gov_demo_001', 'Bengaluru', 'Whitefield', 1250, 2, 2, 1, 'Super built-up  Area', 'Ready To Move', 'Gradient Boosting Regressor', 85.20, '₹85.20 Lakh', 6816, ?)
        """, (now, now))

    conn.commit()
    conn.close()


def hash_password(password: str, salt: str = "bharat_salt_2026") -> str:
    return hashlib.sha256(f"{password}_{salt}".encode('utf-8')).hexdigest()


def create_token(user_id: str) -> str:
    token_str = f"{user_id}:{time.time() + (TOKEN_EXPIRY_HOURS * 3600)}:{secrets.token_hex(16)}"
    return token_str


def verify_token(token: str) -> Optional[str]:
    try:
        parts = token.split(":")
        if len(parts) != 3:
            return None
        user_id, expiry, _ = parts
        if float(expiry) < time.time():
            return None
        return user_id
    except Exception:
        return None


# Initialize SQLite Tables
init_db()


# Pydantic Request Models
class PasswordLoginRequest(BaseModel):
    user_id: str
    password: str
    remember_me: Optional[bool] = False


class SendOtpRequest(BaseModel):
    mobile_or_email: str


class OtpLoginRequest(BaseModel):
    mobile: str
    otp: str


class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    mobile: str
    state: str
    district: str
    user_type: str
    password: str


class ResetPasswordRequest(BaseModel):
    user_id: str
    otp: str
    new_password: str


class EstimateSaveRequest(BaseModel):
    city: str
    locality: str
    total_sqft: float
    bhk: int
    bath: int
    balcony: int
    area_type: str
    availability: str
    model_name: str
    predicted_price_lakhs: float
    formatted_price: str
    price_per_sqft: float


# Helper dependency to authenticate citizen from Header
def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication token required")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Session token has expired or is invalid")
    return user_id


# --- AUTH ENDPOINTS ---

@router.post("/login-password")
def login_password(req: PasswordLoginRequest):
    conn = get_db()
    cursor = conn.cursor()
    clean_id = req.user_id.strip().lower()

    cursor.execute("""
        SELECT * FROM citizens 
        WHERE LOWER(email) = ? OR mobile = ? OR (LOWER(email) = 'demo@portal.in' AND ? IN ('demo', 'demo@portal.in'))
    """, (clean_id, clean_id, clean_id))
    row = cursor.fetchone()

    if not row:
        conn.close()
        raise HTTPException(status_code=400, detail="User ID not registered in citizen database.")

    pwd_hash = hash_password(req.password)
    if row["password_hash"] != pwd_hash and not (row["email"] == "demo@portal.in" and req.password == "Demo@1234"):
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid password. Please check your credentials or reset via OTP.")

    # Update last login
    now = datetime.utcnow().isoformat()
    cursor.execute("UPDATE citizens SET last_login = ? WHERE id = ?", (now, row["id"]))
    conn.commit()

    token = create_token(row["id"])
    user_dict = {
        "id": row["id"],
        "fullName": row["full_name"],
        "email": row["email"],
        "mobile": row["mobile"],
        "state": row["state"],
        "district": row["district"],
        "userType": row["user_type"],
        "role": row["role"],
        "createdAt": row["created_at"],
        "lastLogin": now,
    }
    conn.close()
    return {"success": True, "user": user_dict, "token": token, "message": "Citizen login successful."}


@router.post("/send-otp")
def send_otp(req: SendOtpRequest):
    target = req.mobile_or_email.strip()
    otp_code = "123456" # Demo code
    expires_at = time.time() + 300 # 5 minutes

    ACTIVE_OTPS[target] = {"code": otp_code, "expires_at": expires_at}
    return {
        "success": True,
        "message": f"6-Digit OTP successfully dispatched to {target}. (Demo Sandbox OTP: 123456)",
        "demo_otp": "123456"
    }


@router.post("/login-otp")
def login_otp(req: OtpLoginRequest):
    mobile = req.mobile.strip()
    otp = req.otp.strip()

    if otp != "123456":
        cached = ACTIVE_OTPS.get(mobile)
        if not cached or cached["code"] != otp or cached["expires_at"] < time.time():
            raise HTTPException(status_code=400, detail="Invalid or expired OTP code. Use 123456 for demo.")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM citizens WHERE mobile = ?", (mobile,))
    row = cursor.fetchone()

    now = datetime.utcnow().isoformat()
    if not row:
        # Create new citizen account
        user_id = f"usr_gov_{int(time.time())}"
        full_name = f"Citizen ({mobile[-4:]})"
        email = f"citizen_{mobile[-4:]}@portal.gov.in.demo"
        pwd_hash = hash_password("Demo@1234")

        cursor.execute("""
            INSERT INTO citizens (id, full_name, email, mobile, state, district, user_type, password_hash, role, created_at, last_login)
            VALUES (?, ?, ?, ?, 'Karnataka', 'Bengaluru Urban', 'Buyer', ?, 'CITIZEN', ?, ?)
        """, (user_id, full_name, email, mobile, pwd_hash, now, now))
        conn.commit()

        user_dict = {
            "id": user_id,
            "fullName": full_name,
            "email": email,
            "mobile": mobile,
            "state": "Karnataka",
            "district": "Bengaluru Urban",
            "userType": "Buyer",
            "role": "CITIZEN",
            "createdAt": now,
            "lastLogin": now,
        }
    else:
        user_id = row["id"]
        cursor.execute("UPDATE citizens SET last_login = ? WHERE id = ?", (now, user_id))
        conn.commit()
        user_dict = {
            "id": row["id"],
            "fullName": row["full_name"],
            "email": row["email"],
            "mobile": row["mobile"],
            "state": row["state"],
            "district": row["district"],
            "userType": row["user_type"],
            "role": row["role"],
            "createdAt": row["created_at"],
            "lastLogin": now,
        }

    token = create_token(user_id)
    conn.close()
    return {"success": True, "user": user_dict, "token": token, "message": "OTP verification successful."}


@router.post("/register")
def register_citizen(req: RegisterRequest):
    conn = get_db()
    cursor = conn.cursor()

    email_clean = req.email.strip().lower()
    mobile_clean = req.mobile.strip()

    cursor.execute("SELECT COUNT(*) FROM citizens WHERE LOWER(email) = ?", (email_clean,))
    if cursor.fetchone()[0] > 0:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Email {email_clean} is already registered.")

    cursor.execute("SELECT COUNT(*) FROM citizens WHERE mobile = ?", (mobile_clean,))
    if cursor.fetchone()[0] > 0:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Mobile +91 {mobile_clean} is already registered.")

    user_id = f"usr_gov_{int(time.time())}"
    pwd_hash = hash_password(req.password)
    now = datetime.utcnow().isoformat()

    cursor.execute("""
        INSERT INTO citizens (id, full_name, email, mobile, state, district, user_type, password_hash, role, created_at, last_login)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CITIZEN', ?, ?)
    """, (user_id, req.full_name.strip(), email_clean, mobile_clean, req.state, req.district, req.user_type, pwd_hash, now, now))
    conn.commit()

    token = create_token(user_id)
    user_dict = {
        "id": user_id,
        "fullName": req.full_name.strip(),
        "email": email_clean,
        "mobile": mobile_clean,
        "state": req.state,
        "district": req.district,
        "userType": req.user_type,
        "role": "CITIZEN",
        "createdAt": now,
        "lastLogin": now,
    }
    conn.close()
    return {"success": True, "user": user_dict, "token": token, "message": "Citizen registered successfully."}


@router.post("/forgot-password")
def forgot_password_reset(req: ResetPasswordRequest):
    if req.otp.strip() != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP code. Enter 123456 for demo.")

    clean_id = req.user_id.strip().lower()
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM citizens WHERE LOWER(email) = ? OR mobile = ?", (clean_id, clean_id))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Citizen account not found.")

    pwd_hash = hash_password(req.new_password)
    cursor.execute("UPDATE citizens SET password_hash = ? WHERE id = ?", (pwd_hash, row["id"]))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Password reset successfully. Please login with your new credentials."}


@router.get("/me")
def get_me(user_id: str = Depends(get_current_user_id)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM citizens WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Citizen profile not found.")

    return {
        "id": row["id"],
        "fullName": row["full_name"],
        "email": row["email"],
        "mobile": row["mobile"],
        "state": row["state"],
        "district": row["district"],
        "userType": row["user_type"],
        "role": row["role"],
        "createdAt": row["created_at"],
        "lastLogin": row["last_login"],
    }


# --- SAVED ESTIMATES ENDPOINTS ---

@router.get("/estimates")
def list_estimates(user_id: str = Depends(get_current_user_id)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM saved_estimates 
        WHERE user_id = ? OR user_id = 'usr_gov_demo_001'
        ORDER BY created_at DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "userId": r["user_id"],
            "city": r["city"],
            "locality": r["locality"],
            "total_sqft": r["total_sqft"],
            "bhk": r["bhk"],
            "bath": r["bath"],
            "balcony": r["balcony"],
            "area_type": r["area_type"],
            "availability": r["availability"],
            "model_name": r["model_name"],
            "predicted_price_lakhs": r["predicted_price_lakhs"],
            "formatted_price": r["formatted_price"],
            "price_per_sqft": r["price_per_sqft"],
            "date": r["created_at"],
        })
    return {"estimates": results}


@router.post("/estimates")
def create_estimate(req: EstimateSaveRequest, user_id: str = Depends(get_current_user_id)):
    conn = get_db()
    cursor = conn.cursor()
    est_id = f"est_{int(time.time())}"
    now = datetime.utcnow().isoformat()

    cursor.execute("""
        INSERT INTO saved_estimates (id, user_id, city, locality, total_sqft, bhk, bath, balcony, area_type, availability, model_name, predicted_price_lakhs, formatted_price, price_per_sqft, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (est_id, user_id, req.city, req.locality, req.total_sqft, req.bhk, req.bath, req.balcony, req.area_type, req.availability, req.model_name, req.predicted_price_lakhs, req.formatted_price, req.price_per_sqft, now))
    conn.commit()
    conn.close()

    return {
        "success": True,
        "id": est_id,
        "message": "Property estimate saved to citizen dashboard.",
    }


@router.delete("/estimates/{estimate_id}")
def delete_estimate(estimate_id: str, user_id: str = Depends(get_current_user_id)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM saved_estimates WHERE id = ? AND (user_id = ? OR user_id = 'usr_gov_demo_001')", (estimate_id, user_id))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Estimate removed successfully."}
