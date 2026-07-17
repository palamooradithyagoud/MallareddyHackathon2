from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.settings import UserSettings
from backend.app.models.resume import ResumeVersion, Resume
from backend.app.schemas.settings import UserSettingsResponse, UserSettingsUpdate
from backend.app.utils.helpers import log_activity
import os

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("", response_model=UserSettingsResponse)
def get_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("", response_model=UserSettingsResponse)
def update_settings(
    settings_data: UserSettingsUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
        
    update_dict = settings_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(settings, key, value)
        
    db.commit()
    db.refresh(settings)
    
    # Log Activity
    log_activity(
        db=db,
        user_id=current_user.id,
        action="Settings Update",
        description=f"User updated settings (theme: {settings.theme})",
        ip_address=request.client.host if request.client else None
    )
    
    return settings

@router.delete("/account")
def delete_account(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Retrieve resume versions and delete corresponding files to avoid server bloat
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if resume:
        versions = db.query(ResumeVersion).filter(ResumeVersion.resume_id == resume.id).all()
        for version in versions:
            if os.path.exists(version.file_path):
                try:
                    os.remove(version.file_path)
                except Exception as e:
                    print(f"Failed to delete file {version.file_path}: {e}")
        if os.path.exists(resume.file_path):
            try:
                os.remove(resume.file_path)
            except Exception as e:
                print(f"Failed to delete file {resume.file_path}: {e}")
                
    # Since foreign keys are defined ON DELETE CASCADE, deleting the User deletes:
    # - Profile
    # - CareerPreferences
    # - Resume / ResumeVersion
    # - UserSettings
    # - ActivityLogs
    
    # Perform database deletion
    db.delete(current_user)
    db.commit()
    
    return {"message": "Account and all associated personal data have been permanently deleted"}
