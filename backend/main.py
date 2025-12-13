import os
import shutil
import tempfile
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Depends
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from converter import (
    convert_docx_to_pdf, convert_xlsx_to_pdf, convert_image_to_pdf,
    convert_pptx_to_pdf, convert_html_to_pdf,
    convert_pdf_to_jpg, convert_pdf_to_docx, convert_pdf_to_xlsx, convert_pdf_to_pptx,
    compress_pdf
)
from database import get_db, User
from auth import get_password_hash, verify_password, create_access_token
from datetime import timedelta

app = FastAPI(title="InstantPDF API")

# Allow CORS for frontend
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

def cleanup_files(paths: list[str]):
    """Background task to remove temporary files after response is sent."""
    for path in paths:
        try:
            if os.path.exists(path):
                os.remove(path)
        except Exception as e:
            print(f"Error deleting file {path}: {e}")

@app.get("/")
def read_root():
    return {"message": "InstantPDF API is running"}

# Authentication Endpoints
@app.post("/auth/signup")
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": new_user.email, "id": new_user.id})
    
    return {
        "token": access_token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }

@app.post("/auth/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email, "id": user.id})
    
    return {
        "token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }

@app.post("/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Send password reset email to user via Gmail SMTP"""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    user = db.query(User).filter(User.email == request.email).first()
    
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If an account with that email exists, a reset link has been sent."}
    
    # Create reset token (valid for 1 hour)
    reset_token = create_access_token(
        data={"sub": user.email, "type": "reset"},
        expires_delta=timedelta(hours=1)
    )
    
    # Get email credentials from environment
    smtp_email = os.getenv("SMTP_EMAIL", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    frontend_url = os.getenv("FRONTEND_URL", "https://instant-pdf-neon.vercel.app")
    
    if smtp_email and smtp_password:
        try:
            reset_link = f"{frontend_url}/reset-password?token={reset_token}"
            
            msg = MIMEMultipart()
            msg['From'] = smtp_email
            msg['To'] = user.email
            msg['Subject'] = "InstantPDF - Reset Your Password"
            
            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #ef4444, #f97316); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">InstantPDF</h1>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #1f2937;">Reset Your Password</h2>
                    <p style="color: #4b5563;">Hi {user.name},</p>
                    <p style="color: #4b5563;">We received a request to reset your password. Click the button below to create a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" style="background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">This link will expire in 1 hour.</p>
                    <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(body, 'html'))
            
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, user.email, msg.as_string())
            server.quit()
            
        except Exception as e:
            print(f"Email sending failed: {e}")
    
    return {"message": "If an account with that email exists, a reset link has been sent."}

@app.post("/auth/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset user password with valid token"""
    from auth import verify_token
    
    # Verify token
    payload = verify_token(request.token)
    if not payload or payload.get("type") != "reset":
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Update password
    user.hashed_password = get_password_hash(request.new_password)
    db.commit()
    
    return {"message": "Password reset successfully. You can now login with your new password."}

@app.post("/convert/docx")
async def convert_docx(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith(".docx"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .docx file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + ".pdf"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        convert_docx_to_pdf(input_path, output_path)
        
        # Schedule cleanup
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/pdf", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/xlsx")
async def convert_xlsx(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .xlsx file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + ".pdf"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        convert_xlsx_to_pdf(input_path, output_path)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/pdf", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/image")
async def convert_image(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a JPG or PNG file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + ".pdf"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        convert_image_to_pdf(input_path, output_path)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/pdf", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

# PowerPoint to PDF
@app.post("/convert/pptx")
async def convert_pptx(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.pptx', '.ppt')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pptx file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + ".pdf"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        convert_pptx_to_pdf(input_path, output_path)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/pdf", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

# HTML to PDF
@app.post("/convert/html")
async def convert_html(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.html'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an .html file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + ".pdf"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        convert_html_to_pdf(input_path, output_path)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/pdf", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

# PDF to JPG
@app.post("/convert/pdf-to-jpg")
async def convert_pdf_jpg(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pdf file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + ".jpg"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        convert_pdf_to_jpg(input_path, output_path)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="image/jpeg", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

# PDF to Word
@app.post("/convert/pdf-to-word")
async def convert_pdf_word(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pdf file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + ".docx"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        convert_pdf_to_docx(input_path, output_path)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

# PDF to Excel
@app.post("/convert/pdf-to-excel")
async def convert_pdf_excel(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pdf file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + ".xlsx"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        convert_pdf_to_xlsx(input_path, output_path)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

# PDF to PowerPoint
@app.post("/convert/pdf-to-pptx")
async def convert_pdf_ppt(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pdf file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + ".pptx"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        convert_pdf_to_pptx(input_path, output_path)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

# Import PDF editor functions at the top of main.py
# from pdf_editor import rotate_pdf, add_watermark_to_pdf, add_page_numbers_to_pdf, crop_pdf, edit_pdf_add_text

# PDF Editing Tools
@app.post("/edit/rotate-pdf")
async def rotate_pdf_endpoint(background_tasks: BackgroundTasks, file: UploadFile = File(...), rotation: int = 90):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pdf file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + "_rotated.pdf"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        from pdf_editor import rotate_pdf
        rotate_pdf(input_path, output_path, rotation)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/pdf", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/edit/watermark-pdf")
async def watermark_pdf_endpoint(background_tasks: BackgroundTasks, file: UploadFile = File(...), text: str = "WATERMARK"):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pdf file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + "_watermarked.pdf"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        from pdf_editor import add_watermark_to_pdf
        add_watermark_to_pdf(input_path, output_path, text)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/pdf", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/edit/page-numbers-pdf")
async def page_numbers_pdf_endpoint(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...),
    position: str = "bottom-center",
    start_from: int = 1,
    end_at: int = None
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pdf file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + "_numbered.pdf"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        from pdf_editor import add_page_numbers_to_pdf
        add_page_numbers_to_pdf(input_path, output_path, position, start_from, end_at)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/pdf", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/edit/crop-pdf")
async def crop_pdf_endpoint(background_tasks: BackgroundTasks, file: UploadFile = File(...), margin: int = 50):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pdf file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + "_cropped.pdf"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        from pdf_editor import crop_pdf
        crop_pdf(input_path, output_path, margin)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/pdf", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/edit/add-text-pdf")
async def add_text_pdf_endpoint(background_tasks: BackgroundTasks, file: UploadFile = File(...), text: str = "Added Text", x: int = 100, y: int = 100):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pdf file.")
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + "_edited.pdf"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        from pdf_editor import edit_pdf_add_text
        edit_pdf_add_text(input_path, output_path, text, x, y)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/pdf", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))

# Compress PDF
@app.post("/compress/pdf")
async def compress_pdf_endpoint(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...),
    compression_level: str = "medium"
):
    """
    Compress a PDF file to reduce its size.
    
    Args:
        file: The PDF file to compress
        compression_level: 'low', 'medium', or 'high' compression
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pdf file.")
    
    # Validate compression level
    if compression_level not in ['low', 'medium', 'high']:
        compression_level = 'medium'
    
    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = Path(file.filename).stem + "_compressed.pdf"
    output_path = os.path.join(temp_dir, output_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        compress_pdf(input_path, output_path, compression_level)
        
        background_tasks.add_task(cleanup_files, [input_path, output_path])
        
        return FileResponse(
            output_path, 
            media_type="application/pdf", 
            filename=output_filename
        )
    except Exception as e:
        cleanup_files([input_path])
        raise HTTPException(status_code=500, detail=str(e))
