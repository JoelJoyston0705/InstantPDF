
import fitz
import sys
import os

try:
    with open("bad_pdf.pdf", "wb") as f:
        f.write(os.urandom(100)) # Random bytes
    
    print("Opening garbage file...")
    doc = fitz.open("bad_pdf.pdf")
    print(f"Page count: {len(doc)}")
except Exception as e:
    print(f"Error: {e}")
