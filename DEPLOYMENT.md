# InstantPDF - Deployment Guide for Google Cloud

## 🚀 Deployment Options

### Option 1: Google Cloud Run (Recommended)

**Advantages**: Auto-scaling, pay-per-use, managed infrastructure

#### Prerequisites
1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Create a Google Cloud Project
3. Enable required APIs:
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

#### Deploy Backend
```bash
cd backend

# Set your project ID
PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Build and deploy to Cloud Run
gcloud run deploy instantpdf-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars SECRET_KEY="generate-random-secret-key" \
  --set-env-vars DATABASE_URL="sqlite:///./instantpdf.db" \
  --max-instances 10 \
  --memory 1Gi \
  --timeout 300

# Get the backend URL
BACKEND_URL=$(gcloud run services describe instantpdf-backend --region us-central1 --format 'value(status.url)')
echo "Backend URL: $BACKEND_URL"
```

#### Deploy Frontend
```bash
cd frontend

# Update .env.production with backend URL
echo "VITE_API_URL=$BACKEND_URL" > .env.production

# Build and deploy
gcloud run deploy instantpdf-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --max-instances 10 \
  --memory 512Mi

# Get the frontend URL
FRONTEND_URL=$(gcloud run services describe instantpdf-frontend --region us-central1 --format 'value(status.url)')
echo "Frontend URL: $FRONTEND_URL"
```

#### Update CORS
Update backend CORS to allow your frontend domain:
```bash
gcloud run services update instantpdf-backend \
  --region us-central1 \
  --set-env-vars CORS_ORIGINS="$FRONTEND_URL"
```

---

### Option 2: Google App Engine

#### Backend (app.yaml)
```yaml
runtime: python312
entrypoint: uvicorn main:app --host 0.0.0.0 --port $PORT

env_variables:
  SECRET_KEY: "your-secret-key"
  DATABASE_URL: "sqlite:///./instantpdf.db"

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10
```

Deploy:
```bash
cd backend
gcloud app deploy
```

#### Frontend
Build and deploy to Firebase Hosting or Cloud Storage + CDN

---

### Option 3: Google Kubernetes Engine (GKE)

For enterprise-level deployments with complex requirements.

---

## 🔒 Production Security Checklist

### Environment Variables
- [ ] Generate strong SECRET_KEY: `openssl rand -hex 32`
- [ ] Use Cloud Secret Manager for sensitive data
- [ ] Set proper CORS origins (no wildcards)
- [ ] Configure DATABASE_URL for production DB

### Database
- [ ] Use Cloud SQL (PostgreSQL) instead of SQLite
- [ ] Enable automated backups
- [ ] Set up connection pooling
- [ ] Configure SSL/TLS connections

### Backend Security
```bash
# Update backend/auth.py with environment variable
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-dev-key")

# Update backend/main.py CORS
allow_origins=os.getenv("CORS_ORIGINS", "*").split(",")
```

### Frontend Security
- [ ] Build for production: `npm run build`
- [ ] Use environment-specific API URLs
- [ ] Enable HTTPS only
- [ ] Add security headers (CSP, HSTS)

---

## 📊 Monitoring & Logging

### Cloud Logging
```bash
# View backend logs
gcloud run logs read instantpdf-backend --region us-central1

# View frontend logs
gcloud run logs read instantpdf-frontend --region us-central1
```

### Cloud Monitoring
Set up alerts for:
- Error rates
- Response times
- Memory usage
- Request counts

---

## 💾 Database Migration (SQLite → PostgreSQL)

### 1. Set up Cloud SQL
```bash
gcloud sql instances create instantpdf-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

### 2. Create database
```bash
gcloud sql databases create instantpdf --instance=instantpdf-db
```

### 3. Update DATABASE_URL
```
postgresql://user:password@/instantpdf?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
```

---

## 🌐 Custom Domain Setup

### 1. Map domain to Cloud Run
```bash
gcloud run domain-mappings create \
  --service instantpdf-frontend \
  --domain your-domain.com \
  --region us-central1
```

### 2. Update DNS records as instructed

---

## 📈 Performance Optimization

### Frontend
- [ ] Enable Brotli/Gzip compression
- [ ] Set up Cloud CDN
- [ ] Optimize images (use WebP)
- [ ] Enable lazy loading
- [ ] Implement code splitting

### Backend
- [ ] Add response caching
- [ ] Optimize database queries
- [ ] Set file size limits
- [ ] Use async file processing
- [ ] Enable connection pooling

---

## 💰 Cost Optimization

### Cloud Run Pricing
- Frontend: ~$5-20/month (low traffic)
- Backend: ~$10-50/month (low traffic)

### Tips
- Set max-instances to control costs
- Use minimum instances = 0 for dev
- Monitor with billing alerts
- Use Cloud CDN for static assets

---

## 🔄 CI/CD Setup (Optional)

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: google-github-actions/setup-gcloud@v0
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
      - run: gcloud run deploy ...
```

---

## 📝 Pre-Deployment Checklist

- [ ] Test locally with `docker-compose up`
- [ ] Set all environment variables
- [ ] Generate production SECRET_KEY
- [ ] Configure CORS properly
- [ ] Set up Cloud SQL (if using)
- [ ] Test authentication flow
- [ ] Test file upload/conversion
- [ ] Enable Cloud Logging
- [ ] Set up monitoring alerts
- [ ] Configure custom domain
- [ ] Enable HTTPS
- [ ] Test with production build
- [ ] Set billing alerts

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check logs
gcloud run logs read instantpdf-backend --limit 50

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Import errors
```

### CORS errors
Update backend CORS_ORIGINS to include frontend URL

### File upload fails
Check max file size limits in both frontend and Cloud Run

---

## 📞 Support

For issues, check:
1. Cloud Run logs
2. Cloud Monitoring metrics
3. Error Reporting dashboard

---

## 🎉 Post-Deployment

Your app will be live at:
- Frontend: `https://instantpdf-frontend-xxxxx-uc.a.run.app`
- Backend: `https://instantpdf-backend-xxxxx-uc.a.run.app`

Update DNS if using custom domain!
