from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid

from app.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.models.preferences import CareerPreferences
from app.models.settings import UserSettings
from app.schemas.auth import UserRegister, UserLogin, Token, GoogleLoginRequest, UserResponse
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.utils.helpers import log_activity

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, request: Request, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists"
        )
    
    # Hash password
    hashed_pwd = get_password_hash(user_data.password)
    
    # Create User
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Auto-initialize related models for the user
    profile = Profile(
        user_id=new_user.id,
        full_name=user_data.email.split("@")[0].capitalize(),
        completion_percentage=10  # Initial completion percentage with email
    )
    
    preferences = CareerPreferences(
        user_id=new_user.id,
        skills_interested_in=[]
    )
    
    settings = UserSettings(
        user_id=new_user.id,
        theme="dark"
    )
    
    db.add(profile)
    db.add(preferences)
    db.add(settings)
    db.commit()
    
    # Log Activity
    log_activity(
        db=db,
        user_id=new_user.id,
        action="Registration",
        description="User registered via Email login",
        ip_address=request.client.host if request.client else None
    )
    
    # Create access token
    access_token = create_access_token(data={"sub": new_user.id})
    user_res = UserResponse.model_validate(new_user)
    
    return Token(access_token=access_token, token_type="bearer", user=user_res)

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    # Log Activity
    log_activity(
        db=db,
        user_id=user.id,
        action="Login",
        description="User logged in via Email login",
        ip_address=request.client.host if request.client else None
    )
    
    access_token = create_access_token(data={"sub": user.id})
    user_res = UserResponse.model_validate(user)
    
    return Token(access_token=access_token, token_type="bearer", user=user_res)

@router.post("/google-login", response_model=Token)
def google_login(payload: GoogleLoginRequest, request: Request, db: Session = Depends(get_db)):
    # For Phase 1, we simulate Google sign-in. If the frontend passes a valid-looking Google payload
    # or token, we decode or fallback to a sample Google user registration/login.
    # In a full production implementation, one would use: google.oauth2.id_token.verify_oauth2_token
    
    token_str = payload.token
    
    # Generate mock email from Google token or mock sign-in details
    if token_str.startswith("mock_google_"):
        email = f"{token_str.replace('mock_google_', '')}@gmail.com"
        google_id = token_str
        full_name = token_str.replace('mock_google_', '').capitalize()
    else:
        # Simple extraction or default fallback
        email = "google_user@gmail.com"
        google_id = "google_oauth_123456789"
        full_name = "Google User"
        
    # Check if user already exists by email
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Register user
        user = User(
            email=email,
            google_id=google_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Auto-initialize related models for the user
        profile = Profile(
            user_id=user.id,
            full_name=full_name,
            avatar_url=f"https://api.dicebear.com/7.x/adventurer/svg?seed={full_name}",
            completion_percentage=15
        )
        
        preferences = CareerPreferences(
            user_id=user.id,
            skills_interested_in=[]
        )
        
        settings = UserSettings(
            user_id=user.id,
            theme="dark"
        )
        
        db.add(profile)
        db.add(preferences)
        db.add(settings)
        db.commit()
        
        log_action = "Google Registration"
        log_desc = "User registered via Google OAuth"
    else:
        # Update google_id if not set
        if not user.google_id:
            user.google_id = google_id
            db.commit()
            
        log_action = "Google Login"
        log_desc = "User logged in via Google OAuth"
        
    # Log Activity
    log_activity(
        db=db,
        user_id=user.id,
        action=log_action,
        description=log_desc,
        ip_address=request.client.host if request.client else None
    )
    
    access_token = create_access_token(data={"sub": user.id})
    user_res = UserResponse.model_validate(user)
    
    return Token(access_token=access_token, token_type="bearer", user=user_res)

@router.post("/logout")
def logout(request: Request, db: Session = Depends(get_db)):
    # Since JWT is stateless, logout is handled client-side by purging the token.
    # On the backend, we can log the logout activity if user is authenticated.
    # We will verify if a token is present, else just return success.
    
    # We can try to authenticate the user to log activity
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        payload = verify_password
        # Decode and log if valid
        try:
            from app.utils.security import verify_token
            p_data = verify_token(token)
            if p_data:
                user_id = p_data.get("sub")
                log_activity(
                    db=db,
                    user_id=user_id,
                    action="Logout",
                    description="User logged out",
                    ip_address=request.client.host if request.client else None
                )
        except Exception:
            pass
            
    return {"message": "Logged out successfully"}
