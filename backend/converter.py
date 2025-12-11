import os
import shutil
from pathlib import Path
from docx import Document
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
import openpyxl
from fpdf import FPDF, XPos, YPos
import img2pdf
from PIL import Image
from pptx import Presentation
import pdfplumber
from pdf2image import convert_from_path
from PyPDF2 import PdfReader

def convert_docx_to_pdf(input_path: str, output_path: str):
    try:
        # Load the DOCX document
        doc = Document(input_path)
        
        # Create PDF
        pdf = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        styles = getSampleStyleSheet()
        
        # Add a custom style for better formatting
        normal_style = styles['Normal']
        
        # Process paragraphs
        for para in doc.paragraphs:
            if para.text.strip():
                # Handle different paragraph styles
                if para.style.name.startswith('Heading'):
                    style = styles['Heading1'] if 'Heading 1' in para.style.name else styles['Heading2']
                else:
                    style = normal_style
                
                p = Paragraph(para.text, style)
                story.append(p)
                story.append(Spacer(1, 0.1 * inch))
        
        # If document is empty, add a placeholder
        if not story:
            story.append(Paragraph("Empty document", normal_style))
        
        # Build PDF
        pdf.build(story)
    except Exception as e:
        raise RuntimeError(f"DOCX conversion failed: {e}")

def convert_xlsx_to_pdf(input_path: str, output_path: str):
    try:
        wb = openpyxl.load_workbook(input_path)
        sheet = wb.active
        
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Helvetica", size=10)

        # Iterate rows
        for row in sheet.iter_rows(values_only=True):
            for item in row:
                # Basic cell handling
                text = str(item) if item is not None else ""
                # Simple truncation to avoid breaking layout
                text = (text[:20] + '..') if len(text) > 20 else text
                pdf.cell(40, 10, text, border=1, new_x=XPos.RIGHT, new_y=YPos.TOP)
            pdf.ln()
            
        pdf.output(output_path)
    except Exception as e:
        raise RuntimeError(f"XLSX conversion failed: {e}")

def convert_image_to_pdf(input_path: str, output_path: str):
    try:
        with Image.open(input_path) as img:
            img.verify()
        
        with open(output_path, "wb") as f:
            f.write(img2pdf.convert(input_path))
    except Exception as e:
        raise RuntimeError(f"Image conversion failed: {e}")

def convert_pptx_to_pdf(input_path: str, output_path: str):
    try:
        # Load PowerPoint presentation
        prs = Presentation(input_path)
        
        # Create PDF
        pdf = FPDF(orientation='L')  # Landscape for slides
        pdf.set_auto_page_break(auto=False)
        
        # Extract text from slides
        for slide in prs.slides:
            pdf.add_page()
            pdf.set_font("Helvetica", size=12)
            y_position = 20
            
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    text = shape.text.strip()
                    if text:
                        pdf.set_xy(20, y_position)
                        pdf.multi_cell(0, 10, text)
                        y_position += 15
        
        pdf.output(output_path)
    except Exception as e:
        raise RuntimeError(f"PowerPoint conversion failed: {e}")

def convert_html_to_pdf(input_path: str, output_path: str):
    try:
        # Read HTML content
        with open(input_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Simple HTML to PDF conversion
        from reportlab.platypus import SimpleDocTemplate, Paragraph
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib.pagesizes import letter
        import re
        
        pdf = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Strip HTML tags for simple conversion
        text = re.sub('<[^<]+?>', '', html_content)
        
        for line in text.split('\n'):
            if line.strip():
                p = Paragraph(line.strip(), styles['Normal'])
                story.append(p)
        
        pdf.build(story)
    except Exception as e:
        raise RuntimeError(f"HTML conversion failed: {e}")

# PDF to Other Formats
def convert_pdf_to_jpg(input_path: str, output_path: str):
    try:
        # Convert PDF to images (first page)
        images = convert_from_path(input_path, first_page=1, last_page=1)
        
        if images:
            images[0].save(output_path, 'JPEG')
    except Exception as e:
        raise RuntimeError(f"PDF to JPG conversion failed: {e}")

def convert_pdf_to_docx(input_path: str, output_path: str):
    try:
        # Extract text from PDF
        pdf = PdfReader(input_path)
        
        # Create new Word document
        doc = Document()
        
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                doc.add_paragraph(text)
                doc.add_page_break()
        
        doc.save(output_path)
    except Exception as e:
        raise RuntimeError(f"PDF to Word conversion failed: {e}")

def convert_pdf_to_xlsx(input_path: str, output_path: str):
    try:
        # Extract text from PDF
        with pdfplumber.open(input_path) as pdf:
            wb = openpyxl.Workbook()
            ws = wb.active
            
            for page in pdf.pages:
                # Try to extract tables
                tables = page.extract_tables()
                if tables:
                    for table in tables:
                        for row in table:
                            ws.append(row)
                else:
                    # If no tables, extract text
                    text = page.extract_text()
                    if text:
                        ws.append([text])
            
            wb.save(output_path)
    except Exception as e:
        raise RuntimeError(f"PDF to Excel conversion failed: {e}")

def convert_pdf_to_pptx(input_path: str, output_path: str):
    try:
        from pptx.util import Inches
        
        # Extract text from PDF
        pdf = PdfReader(input_path)
        
        # Create PowerPoint
        prs = Presentation()
        
        for page in pdf.pages:
            slide = prs.slides.add_slide(prs.slide_layouts[1])
            title = slide.shapes.title
            content = slide.placeholders[1]
            
            text = page.extract_text()
            if text:
                title.text = f"Page {pdf.pages.index(page) + 1}"
                content.text = text[:500]  # Limit text length
        
        prs.save(output_path)
    except Exception as e:
        raise RuntimeError(f"PDF to PowerPoint conversion failed: {e}")

