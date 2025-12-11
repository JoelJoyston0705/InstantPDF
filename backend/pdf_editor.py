import fitz  # PyMuPDF
from pypdf import PdfReader, PdfWriter
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
    """Add watermark text to PDF pages"""
    try:
        doc = fitz.open(input_path)
    except Exception:
        # Fallback: Repair with Ghostscript
        import subprocess
        print("Standard open failed. Attempting Ghostscript repair...")
        repaired_path = input_path.replace(".pdf", "_repaired.pdf")
        try:
            subprocess.run([
                "gs", "-o", repaired_path, "-sDEVICE=pdfwrite", "-dPDFSETTINGS=/default", "-dNOPAUSE", "-dBATCH", input_path
            ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            doc = fitz.open(repaired_path)
        except Exception as e_gs:
             raise RuntimeError(f"Watermark failed (even after repair): {e_gs}")

    try:
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
    except Exception:
         # Fallback: Repair with Ghostscript
        import subprocess
        print("Standard open failed. Attempting Ghostscript repair...")
        repaired_path = input_path.replace(".pdf", "_repaired.pdf")
        try:
            subprocess.run([
                "gs", "-o", repaired_path, "-sDEVICE=pdfwrite", "-dPDFSETTINGS=/default", "-dNOPAUSE", "-dBATCH", input_path
            ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            doc = fitz.open(repaired_path)
        except Exception as e_gs:
             raise RuntimeError(f"Page numbering failed (even after repair): {e_gs}")

    try:
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
    except Exception:
         # Fallback: Repair with Ghostscript
        import subprocess
        print("Standard open failed. Attempting Ghostscript repair...")
        repaired_path = input_path.replace(".pdf", "_repaired.pdf")
        try:
            subprocess.run([
                "gs", "-o", repaired_path, "-sDEVICE=pdfwrite", "-dPDFSETTINGS=/default", "-dNOPAUSE", "-dBATCH", input_path
            ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            doc = fitz.open(repaired_path)
        except Exception as e_gs:
             raise RuntimeError(f"Cropping failed (even after repair): {e_gs}")

    try:
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
    """Add text to PDF at specified position using multiple strategies for robustness"""
    
    # Strategy 1: pikepdf (Best for repair and quality)
    try:
        import pikepdf
        from io import BytesIO
        from reportlab.pdfgen import canvas
        
        pdf = pikepdf.Pdf.open(input_path, allow_overwriting_input=True)
        page = pdf.pages[0]
        rect = page.mediabox
        page_width = float(rect[2]) - float(rect[0])
        page_height = float(rect[3]) - float(rect[1])
        
        packet = BytesIO()
        can = canvas.Canvas(packet, pagesize=(page_width, page_height))
        can.setFont("Helvetica", 12)
        rl_y = page_height - y
        can.drawString(x, rl_y, text)
        can.save()
        packet.seek(0)
        
        text_pdf = pikepdf.Pdf.open(packet)
        text_page = text_pdf.pages[0]
        page.overlay(text_page, pikepdf.Rectangle(0, 0, page_width, page_height))
        pdf.save(output_path)
        return
    except Exception as e_pikepdf:
        print(f"Strategy 1 (pikepdf) failed: {e_pikepdf}")

    # Strategy 2: pypdf (Lenient parser)
    try:
        from io import BytesIO
        from reportlab.pdfgen import canvas
        from pypdf import PdfReader, PdfWriter

        reader = PdfReader(input_path)
        writer = PdfWriter()
        page = reader.pages[0]
        
        # pypdf coordinates might vary, try to get width/height safely
        try:
            page_width = float(page.mediabox.width)
            page_height = float(page.mediabox.height)
        except:
            page_width = 612 # Fallback to Letter width
            page_height = 792 # Fallback to Letter height

        packet = BytesIO()
        can = canvas.Canvas(packet, pagesize=(page_width, page_height))
        can.setFont("Helvetica", 12)
        rl_y = page_height - y
        can.drawString(x, rl_y, text)
        can.save()
        packet.seek(0)
        
        overlay_reader = PdfReader(packet)
        overlay_page = overlay_reader.pages[0]
        
        # Merge
        page.merge_page(overlay_page)
        writer.add_page(page)
        
        for i in range(1, len(reader.pages)):
            writer.add_page(reader.pages[i])
            
        with open(output_path, "wb") as f:
            writer.write(f)
        return
    except Exception as e_pypdf:
        print(f"Strategy 2 (pypdf) failed: {e_pypdf}")

    # Strategy 3: PyMuPDF / fitz (Direct modification, very fast)
    try:
        doc = fitz.open(input_path)
        page = doc[0]
        text_rect = fitz.Rect(x, y, x + 300, y + 50)
        page.insert_textbox(
            text_rect,
            text,
            fontsize=12,
            color=(0, 0, 0),
            align=fitz.TEXT_ALIGN_LEFT
        )
        doc.save(output_path)
        doc.close()
        return
    except Exception as e_fitz:
        print(f"Strategy 3 (fitz) failed: {e_fitz}")
        
    # If all fail
    # Strategy 4: The Nuclear Option (Ghostscript Repair + Fitz)
    try:
        import subprocess
        print("Strategies 1-3 failed. Attempting Ghostscript repair...")
        
        repaired_path = input_path.replace(".pdf", "_repaired.pdf")
        
        # GS command to repair/rewrite PDF
        # -o output -sDEVICE=pdfwrite -dPDFSETTINGS=/default input
        subprocess.run([
            "gs", "-o", repaired_path, "-sDEVICE=pdfwrite", "-dPDFSETTINGS=/default", "-dNOPAUSE", "-dBATCH", input_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Now try Fitz again on the repaired file
        doc = fitz.open(repaired_path)
        page = doc[0]
        text_rect = fitz.Rect(x, y, x + 300, y + 50)
        page.insert_textbox(
            text_rect,
            text,
            fontsize=12,
            color=(0, 0, 0),
            align=fitz.TEXT_ALIGN_LEFT
        )
        doc.save(output_path)
        doc.close()
        
        # Cleanup
        if os.path.exists(repaired_path):
            os.remove(repaired_path)
        return

    except Exception as e_gs:
        print(f"Strategy 4 (Ghostscript) failed: {e_gs}")

    raise RuntimeError("PDF is too severely corrupted. Even repair attempts failed.")
