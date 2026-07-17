from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.profile import Profile
from backend.app.models.resume import Resume
from backend.app.models.activity import ActivityLog
from backend.app.schemas.dashboard import DashboardResponse, ActivityLogResponse
from backend.app.schemas.resume import ResumeResponse
from typing import Dict, Any

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch profile
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    profile_completion = profile.completion_percentage if profile else 0
    
    # Fetch current resume
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    resume_uploaded = resume is not None
    
    resume_res = None
    if resume:
        resume_res = ResumeResponse.model_validate(resume)
        
    # Fetch recent activity logs (limit to 5)
    activities = db.query(ActivityLog)\
        .filter(ActivityLog.user_id == current_user.id)\
        .order_by(ActivityLog.created_at.desc())\
        .limit(5)\
        .all()
        
    activities_res = [ActivityLogResponse.model_validate(act) for act in activities]
    
    # Build statistics card info
    stats = {
        "profile_completion": f"{profile_completion}%",
        "resume_status": "Uploaded" if resume_uploaded else "Missing",
        "saved_jobs_count": 5,      # Mock stats matching our placeholders
        "applications_count": 3,    # Mock stats matching our placeholders
        "activity_count": len(activities_res)
    }
    
    # Placeholder saved jobs (rich SaaS placeholders)
    saved_jobs = [
        {"id": "j1", "title": "Frontend Engineer", "company": "Stripe", "location": "Remote (USA)", "salary": "$130k - $160k", "posted": "2 days ago"},
        {"id": "j2", "title": "Full Stack Developer", "company": "Vercel", "location": "Hybrid (SF)", "salary": "$140k - $180k", "posted": "1 week ago"},
        {"id": "j3", "title": "Software Engineer (Backend)", "company": "Linear", "location": "Remote", "salary": "$150k - $190k", "posted": "3 days ago"},
        {"id": "j4", "title": "Junior Python Developer", "company": "FastAPI Labs", "location": "Remote (EU)", "salary": "€50k - €70k", "posted": "5 days ago"},
        {"id": "j5", "title": "Security Engineer", "company": "Clerk", "location": "Boston, MA", "salary": "$160k - $210k", "posted": "Yesterday"}
    ]
    
    # Placeholder job applications (rich SaaS placeholders)
    applications = [
        {"id": "a1", "title": "Software Engineer Intern", "company": "Google", "status": "Interviewing", "applied_date": "2026-07-10", "stage": "Technical Round 2"},
        {"id": "a2", "title": "Associate Engineer", "company": "Supabase", "status": "Applied", "applied_date": "2026-07-15", "stage": "Initial Screening"},
        {"id": "a3", "title": "React Specialist", "company": "Meta", "status": "Rejected", "applied_date": "2026-06-20", "stage": "Resume Screen"}
    ]
    
    # Placeholder AI Career Insights (rich SaaS placeholders)
    ai_insights = [
        {"id": "i1", "type": "warning", "message": "Your profile lacks experience details. Add your recent intern role to boost match score.", "field": "Profile"},
        {"id": "i2", "type": "tip", "message": "Your resume has high ATS compatibility (88%) for 'Frontend Engineer' roles. Add TypeScript project details to reach 95%.", "field": "Resume"},
        {"id": "i3", "type": "info", "message": "Based on your Career Preferences, Python is a strong match. Consider learning Go to unlock 35% more backend roles.", "field": "Preferences"}
    ]
    
    return DashboardResponse(
        profile_completion=profile_completion,
        resume_uploaded=resume_uploaded,
        resume=resume_res,
        stats=stats,
        recent_activities=activities_res,
        saved_jobs=saved_jobs,
        applications=applications,
        ai_insights=ai_insights
    )
