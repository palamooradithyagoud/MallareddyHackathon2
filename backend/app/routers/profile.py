from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.profile import Profile
from app.schemas.profile import ProfileResponse, ProfileUpdate
from app.utils.helpers import log_activity, calculate_completion_percentage
from typing import Any

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        # Fallback creation if somehow profile was deleted/missing
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    return profile

@router.put("", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    # Exclude unset fields if wanted, or support absolute overrides.
    # To support setting values to null/empty, we can update fields that are provided
    update_dict = profile_data.model_dump(exclude_unset=True)
    
    # Map fields
    for key, value in update_dict.items():
        # Handle experience and certification serialization
        if key in ["experience", "certifications"]:
            # Convert list of pydantic schemas to simple list of dicts for SQL JSON storage
            if value is not None:
                serialized_list = [item.model_dump() if hasattr(item, "model_dump") else item for item in value]
                setattr(profile, key, serialized_list)
        else:
            setattr(profile, key, value)
            
    # Recalculate completion percentage
    profile.completion_percentage = calculate_completion_percentage(profile)
    
    db.commit()
    db.refresh(profile)
    
    # Log Activity
    log_activity(
        db=db,
        user_id=current_user.id,
        action="Profile Update",
        description="User updated profile details",
        ip_address=request.client.host if request.client else None
    )
    
    return profile
