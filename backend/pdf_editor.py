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
    """Add text to PDF at specified position using pikepdf and ReportLab (Robust)"""
    try:
        import pikepdf
        from io import BytesIO
        from reportlab.pdfgen import canvas
        
        # Open with pikepdf (it automatically repairs many issues)
        pdf = pikepdf.Pdf.open(input_path, allow_overwriting_input=True)
        
        # Get first page dimensions
        page = pdf.pages[0]
        # pikepdf mediabox is [x0, y0, x1, y1]
        rect = page.mediabox
        page_width = float(rect[2]) - float(rect[0])
        page_height = float(rect[3]) - float(rect[1])
        
        # Create a new PDF with ReportLab (text layer)
        packet = BytesIO()
        can = canvas.Canvas(packet, pagesize=(page_width, page_height))
        can.setFont("Helvetica", 12)
        
        # Convert coordinates: Top-Left (Frontend) -> Bottom-Left (PDF)
        rl_y = page_height - y
        
        can.drawString(x, rl_y, text)
        can.save()
        
        packet.seek(0)
        
        # Read the watermark PDF with pikepdf
        text_pdf = pikepdf.Pdf.open(packet)
        text_page = text_pdf.pages[0]
        
        # Overlay the text page onto the original page
        # check if overlay needs explicit rectangle
        page.overlay(text_page, pikepdf.Rectangle(0, 0, page_width, page_height))
        
        pdf.save(output_path)
        
    except Exception as e:
        raise RuntimeError(f"PDF text addition failed: {e}")
