# InstantPDF 📄⚡

> Transform documents instantly with a beautiful, Apple-inspired interface

![InstantPDF](https://img.shields.io/badge/status-production-green)
![Python](https://img.shields.io/badge/python-3.12-blue)
![React](https://img.shields.io/badge/react-19.2-blue)
![FastAPI](https://img.shields.io/badge/fastapi-latest-teal)

## ✨ Features

- **Word to PDF** - Convert DOCX files to PDF
- **Excel to PDF** - Transform spreadsheets to PDF
- **Image to PDF** - Convert JPG/PNG images to PDF
- **User Authentication** - Secure signup and login with JWT
- **Apple-Style UI** - Premium design with glassmorphism and animations
- **Fast & Secure** - Files automatically deleted after conversion

## 🚀 Quick Start

### Local Development

#### Prerequisites
- Python 3.12+
- Node.js 20+
- npm or yarn

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173

### Docker Setup
```bash
docker-compose up
```

## 📦 Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **TailwindCSS 4** - Styling
- **React Router** - Navigation
- **Lucide Icons** - Icon library

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **Python-JOSE** - JWT authentication
- **Passlib** - Password hashing
- **python-docx** - DOCX processing
- **ReportLab** - PDF generation

## 🔐 Security

- Passwords hashed with bcrypt
- JWT token authentication
- CORS protection
- SQL injection prevention
- XSS protection
- File type validation

## 📄 API Documentation

Once running, visit:
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Google Cloud Run
- Google App Engine
- Google Kubernetes Engine
- Docker deployments

## 🛠️ Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./instantpdf.db
CORS_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## 📊 Project Structure

```
InstantPDF/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── auth.py              # Authentication utilities
│   ├── database.py          # Database configuration
│   ├── converter.py         # File conversion logic
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── components/      # React components
│   │   └── index.css        # Global styles
│   ├── package.json         # Node dependencies
│   └── Dockerfile           # Frontend container
└── docker-compose.yml       # Multi-container setup
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Created with ❤️ for fast, secure document conversion

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📞 Support

- 📧 Email: support@instantpdf.com
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](#)

## 🎯 Roadmap

- [ ] PDF Merge & Split
- [ ] PDF Compression
- [ ] OCR support
- [ ] Batch processing
- [ ] Cloud storage integration
- [ ] Mobile app

---

Made with ⚡ by [Your Name]
