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
    """Add text to PDF at specified position"""
    try:
        doc = fitz.open(input_path)
        
        # Add text to first page
        page = doc[0]
        
        # Insert text at specified coordinates
        text_rect = fitz.Rect(x, y, x + 200, y + 50)
        page.insert_textbox(
            text_rect,
            text,
            fontsize=12,
            color=(0, 0, 0),
            align=fitz.TEXT_ALIGN_LEFT
        )
        
        doc.save(output_path)
        doc.close()
    except Exception as e:
        raise RuntimeError(f"PDF text addition failed: {e}")
