# Deployment Guide

This guide covers how to deploy Sandy's Pet Care Solution application to various environments.

## Prerequisites

- Node.js 14+ installed
- MongoDB or PostgreSQL database
- Domain name (for production)
- SSL certificate (for production)

## Environment Setup

### Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
```

### Production

#### Option 1: Traditional Server Deployment

1. **Server Setup**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Database Setup**
   ```bash
   # MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Application Deployment**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd sandys
   
   # Install backend dependencies
   cd backend
   npm install --production
   
   # Build frontend
   cd ../frontend
   npm install
   npm run build
   
   # Copy build files to nginx directory
   sudo cp -r build/* /var/www/html/
   ```

4. **Environment Configuration**
   ```bash
   # Create production environment file
   cd backend
   cp .env.example .env
   
   # Edit with production values
   nano .env
   ```

5. **PM2 Configuration**
   ```bash
   # Start backend with PM2
   pm2 start server.js --name "petshop-backend"
   pm2 save
   pm2 startup
   ```

6. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/petshop
   server {
       listen 80;
       server_name your-domain.com;
       
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **SSL Configuration**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Obtain SSL certificate
   sudo certbot --nginx -d your-domain.com
   ```

#### Option 2: Docker Deployment

1. **Create Dockerfile for Backend**
   ```dockerfile
   # backend/Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm install --production
   
   COPY . .
   
   EXPOSE 5000
   
   CMD ["npm", "start"]
   ```

2. **Create Dockerfile for Frontend**
   ```dockerfile
   # frontend/Dockerfile
   FROM node:18-alpine as builder
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm install
   
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   
   EXPOSE 80
   ```

3. **Docker Compose for Production**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   
   services:
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       depends_on:
         - backend
   
     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - MONGODB_URI=mongodb://mongodb:27017/petshop
         - JWT_SECRET=${JWT_SECRET}
       depends_on:
         - mongodb
   
     mongodb:
       image: mongo:6.0
       volumes:
         - mongodb_data:/data/db
       environment:
         - MONGO_INITDB_ROOT_USERNAME=admin
         - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
   
   volumes:
     mongodb_data:
   ```

4. **Deploy with Docker**
   ```bash
   # Build and start containers
   docker-compose -f docker-compose.prod.yml up -d
   ```

#### Option 3: Cloud Platform Deployment

##### Heroku

1. **Backend Deployment**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login to Heroku
   heroku login
   
   # Create app
   heroku create petshop-backend
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   
   # Deploy
   git push heroku main
   ```

2. **Frontend Deployment**
   ```bash
   # Create app
   heroku create petshop-frontend
   
   # Set buildpack
   heroku buildpacks:set https://github.com/mars/create-react-app-buildpack.git
   
   # Deploy
   git push heroku main
   ```

##### AWS

1. **Backend on AWS Lambda**
   ```bash
   # Install Serverless Framework
   npm install -g serverless
   
   # Create serverless.yml
   # Deploy
   serverless deploy
   ```

2. **Frontend on AWS S3 + CloudFront**
   ```bash
   # Build frontend
   npm run build
   
   # Deploy to S3
   aws s3 sync build/ s3://your-bucket-name
   
   # Invalidate CloudFront
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/petshop
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **Environment Variables**: Never commit sensitive data to version control
3. **CORS**: Configure CORS properly for your domain
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Input Validation**: Validate all user inputs
6. **Authentication**: Use strong JWT secrets and implement proper session management

## Monitoring

1. **PM2 Monitoring**
   ```bash
   pm2 monit
   pm2 logs
   ```

2. **Nginx Logs**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Application Monitoring**
   - Set up monitoring services (New Relic, DataDog)
   - Implement health check endpoints
   - Monitor database performance

## Backup Strategy

1. **Database Backup**
   ```bash
   # MongoDB
   mongodump --uri="mongodb://localhost:27017/petshop" --out=/path/to/backup
   
   # PostgreSQL
   pg_dump petshop > backup.sql
   ```

2. **Automated Backups**
   ```bash
   # Create backup script
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   mongodump --uri="mongodb://localhost:27017/petshop" --out="/backups/petshop_$DATE"
   
   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

## Troubleshooting

1. **Check Application Logs**
   ```bash
   pm2 logs petshop-backend
   ```

2. **Check Database Connection**
   ```bash
   mongosh --host localhost --port 27017
   ```

3. **Check Nginx Configuration**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Monitor System Resources**
   ```bash
   htop
   df -h
   free -h
   ```