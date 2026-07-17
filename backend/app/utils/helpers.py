from sqlalchemy.orm import Session
from app.models.activity import ActivityLog
from app.models.profile import Profile
import json

def log_activity(db: Session, user_id: str, action: str, description: str, ip_address: str = None):
    try:
        activity = ActivityLog(
            user_id=user_id,
            action=action,
            description=description,
            ip_address=ip_address
        )
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity
    except Exception as e:
        db.rollback()
        print(f"Error logging activity: {e}")
        return None

def calculate_completion_percentage(profile: Profile) -> int:
    # Calculate profile completion percentage based on filled fields
    fields = [
        profile.full_name,
        profile.phone_number,
        profile.date_of_birth,
        profile.gender,
        profile.location,
        profile.college,
        profile.degree,
        profile.graduation_year,
        profile.cgpa,
        profile.skills,
        profile.about_me,
        profile.linkedin_url,
        profile.github_url,
        profile.portfolio_url
    ]
    
    filled_count = sum(1 for field in fields if field is not None and field != "")
    
    # Check lists / lists of dicts
    if profile.experience and len(profile.experience) > 0:
        filled_count += 1
    if profile.certifications and len(profile.certifications) > 0:
        filled_count += 1
        
    total_fields = len(fields) + 2
    percentage = int((filled_count / total_fields) * 100)
    return min(percentage, 100)
