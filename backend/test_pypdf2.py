
from PyPDF2 import PdfReader
import os

try:
    with open("bad_pdf_2.pdf", "wb") as f:
        f.write(os.urandom(100))
    
    print("Opening garbage file with PyPDF2...")
    reader = PdfReader("bad_pdf_2.pdf")
    print(f"Pages: {len(reader.pages)}")
except Exception as e:
    print(f"Error: {e}")
