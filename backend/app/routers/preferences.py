from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.preferences import CareerPreferences
from backend.app.schemas.preferences import CareerPreferencesResponse, CareerPreferencesUpdate
from backend.app.utils.helpers import log_activity

router = APIRouter(prefix="/preferences", tags=["Career Preferences"])

@router.get("", response_model=CareerPreferencesResponse)
def get_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prefs = db.query(CareerPreferences).filter(CareerPreferences.user_id == current_user.id).first()
    if not prefs:
        prefs = CareerPreferences(user_id=current_user.id, skills_interested_in=[])
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    return prefs

@router.put("", response_model=CareerPreferencesResponse)
def update_preferences(
    pref_data: CareerPreferencesUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prefs = db.query(CareerPreferences).filter(CareerPreferences.user_id == current_user.id).first()
    if not prefs:
        prefs = CareerPreferences(user_id=current_user.id, skills_interested_in=[])
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
        
    update_dict = pref_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(prefs, key, value)
        
    db.commit()
    db.refresh(prefs)
    
    # Log Activity
    log_activity(
        db=db,
        user_id=current_user.id,
        action="Preferences Update",
        description="User updated career preferences",
        ip_address=request.client.host if request.client else None
    )
    
    return prefs
