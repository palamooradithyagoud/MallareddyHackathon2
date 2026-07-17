from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import uuid

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.resume import Resume, ResumeVersion
from app.schemas.resume import ResumeResponse
from app.config import settings
from app.utils.helpers import log_activity

router = APIRouter(prefix="/resume", tags=["Resume"])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_MIME_TYPE = "application/pdf"

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file type
    if not file.filename.lower().endswith(".pdf") and file.content_type != ALLOWED_MIME_TYPE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )
        
    # Read file content to check size
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 5MB limit"
        )
        
    # Reset read pointer
    await file.seek(0)
    
    # Query if user already has a resume
    existing_resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    
    next_version = 1
    if existing_resume:
        # Get highest version from resume versions
        highest_version = db.query(ResumeVersion)\
            .filter(ResumeVersion.resume_id == existing_resume.id)\
            .order_by(ResumeVersion.version.desc())\
            .first()
        if highest_version:
            next_version = highest_version.version + 1
            
    # Define file name and path
    unique_id = uuid.uuid4().hex
    filename = f"{current_user.id}_v{next_version}_{unique_id}.pdf"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    # Write to local storage
    try:
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
        
    # Database persistence
    if existing_resume:
        # Update current resume row
        existing_resume.name = file.filename
        existing_resume.file_path = file_path
        existing_resume.file_size = file_size
        existing_resume.mime_type = ALLOWED_MIME_TYPE
        
        resume_record = existing_resume
    else:
        # Create new resume row
        resume_record = Resume(
            user_id=current_user.id,
            name=file.filename,
            file_path=file_path,
            file_size=file_size,
            mime_type=ALLOWED_MIME_TYPE
        )
        db.add(resume_record)
        db.commit()
        db.refresh(resume_record)
        
    # Create version entry
    version_record = ResumeVersion(
        resume_id=resume_record.id,
        version=next_version,
        name=file.filename,
        file_path=file_path,
        file_size=file_size
    )
    db.add(version_record)
    db.commit()
    db.refresh(resume_record)
    
    # Log Activity
    log_activity(
        db=db,
        user_id=current_user.id,
        action="Resume Uploaded",
        description=f"Uploaded resume version {next_version}: {file.filename}",
        ip_address=request.client.host if request.client else None
    )
    
    return resume_record

@router.get("", response_model=ResumeResponse)
def get_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume found for this user"
        )
    return resume

@router.delete("")
def delete_resume(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume to delete"
        )
        
    # Fetch all versions to delete files from filesystem
    versions = db.query(ResumeVersion).filter(ResumeVersion.resume_id == resume.id).all()
    
    # Try deleting files
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
            
    # Delete DB records
    db.delete(resume)
    db.commit()
    
    # Log Activity
    log_activity(
        db=db,
        user_id=current_user.id,
        action="Resume Deleted",
        description="User deleted current resume and all versions",
        ip_address=request.client.host if request.client else None
    )
    
    return {"message": "Resume and version history deleted successfully"}

@router.get("/preview")
def preview_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Retrieve current resume
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume or not os.path.exists(resume.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file not found"
        )
        
    return FileResponse(
        path=resume.file_path,
        media_type=resume.mime_type,
        filename=resume.name
    )

@router.get("/version/{version_id}/preview")
def preview_resume_version(
    version_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Query version details and ensure it belongs to the current user's resume
    version = db.query(ResumeVersion)\
        .join(Resume, Resume.id == ResumeVersion.resume_id)\
        .filter(ResumeVersion.id == version_id, Resume.user_id == current_user.id)\
        .first()
        
    if not version or not os.path.exists(version.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume version file not found"
        )
        
    return FileResponse(
        path=version.file_path,
        media_type="application/pdf",
        filename=version.name
    )
