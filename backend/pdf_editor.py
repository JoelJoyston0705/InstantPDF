import fitz  # PyMuPDF
from PyPDF2 import PdfReader, PdfWriter
import os

def rotate_pdf(input_path: str, output_path: str, rotation: int = 90):
    """Rotate PDF pages by specified degrees (90, 180, 270)"""
    try:
        pdf_reader = PdfReader(input_path)
        pdf_writer = PdfWriter()
        
        for page in pdf_reader.pages:
            page.rotate(rotation)
            pdf_writer.add_page(page)
        
        with open(output_path, 'wb') as output_file:
            pdf_writer.write(output_file)
    except Exception as e:
        raise RuntimeError(f"PDF rotation failed: {e}")

def add_watermark_to_pdf(input_path: str, output_path: str, watermark_text: str = "WATERMARK"):
    """Add watermark text to PDF pages"""
    try:
        doc = fitz.open(input_path)
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            
            # Get page dimensions
            rect = page.rect
            
            # Add watermark text (centered, diagonal, semi-transparent)
            text_rect = fitz.Rect(0, 0, rect.width, rect.height)
            
            # Insert diagonal watermark
            page.insert_textbox(
                text_rect,
                watermark_text,
                fontsize=60,
                align=fitz.TEXT_ALIGN_CENTER,
                color=(0.8, 0.8, 0.8),  # Light gray
                rotate=45,
                overlay=True
            )
        
        doc.save(output_path)
        doc.close()
    except Exception as e:
        raise RuntimeError(f"Watermark addition failed: {e}")

def add_page_numbers_to_pdf(input_path: str, output_path: str):
    """Add page numbers to PDF"""
    try:
        doc = fitz.open(input_path)
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            rect = page.rect
            
            # Add page number at bottom center
            page_text = f"Page {page_num + 1}"
            text_rect = fitz.Rect(
                rect.width / 2 - 30,
                rect.height - 30,
                rect.width / 2 + 30,
                rect.height - 10
            )
            
            page.insert_textbox(
                text_rect,
                page_text,
                fontsize=12,
                align=fitz.TEXT_ALIGN_CENTER,
                color=(0, 0, 0)
            )
        
        doc.save(output_path)
        doc.close()
    except Exception as e:
        raise RuntimeError(f"Page numbering failed: {e}")

def crop_pdf(input_path: str, output_path: str, margin: int = 50):
    """Crop PDF margins by specified pixels"""
    try:
        doc = fitz.open(input_path)
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            rect = page.rect
            
            # Create cropped rectangle (remove margins)
            crop_rect = fitz.Rect(
                rect.x0 + margin,
                rect.y0 + margin,
                rect.x1 - margin,
                rect.y1 - margin
            )
            
            page.set_cropbox(crop_rect)
        
        doc.save(output_path)
        doc.close()
    except Exception as e:
        raise RuntimeError(f"PDF cropping failed: {e}")

def edit_pdf_add_text(input_path: str, output_path: str, text: str = "Added Text", x: int = 100, y: int = 100):
    """Add text to PDF at specified position using PyPDF2 and ReportLab"""
    try:
        from io import BytesIO
        from reportlab.pdfgen import canvas
        
        # Read the existing PDF
        existing_pdf = PdfReader(input_path)
        output = PdfWriter()
        
        # Get first page to determine dimensions
        page = existing_pdf.pages[0]
        page_width = float(page.mediabox.width)
        page_height = float(page.mediabox.height)
        
        # Create a new PDF with ReportLab (for the text)
        packet = BytesIO()
        can = canvas.Canvas(packet, pagesize=(page_width, page_height))
        can.setFont("Helvetica", 12)
        
        # Convert coordinates: PyMuPDF (Top-Left) -> ReportLab (Bottom-Left)
        # Assuming y passed from frontend is from top
        rl_y = page_height - y
        
        can.drawString(x, rl_y, text)
        can.save()
        
        # Move to the beginning of the StringIO buffer
        packet.seek(0)
        new_pdf = PdfReader(packet)
        
        # Merge the text page with the existing page
        page.merge_page(new_pdf.pages[0])
        output.add_page(page)
        
        # Add the rest of the pages
        for i in range(1, len(existing_pdf.pages)):
            output.add_page(existing_pdf.pages[i])
            
        with open(output_path, "wb") as f:
            output.write(f)
            
    except Exception as e:
        raise RuntimeError(f"PDF text addition failed: {e}")
