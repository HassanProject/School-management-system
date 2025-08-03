# Quick Start Guide - School Management System

This guide will help you get the School Management System up and running quickly.

## 🚀 Quick Start (5 minutes)

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-management-system
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Option 2: Manual Setup

1. **Prerequisites**
   - Node.js 16+
   - PostgreSQL
   - npm or yarn

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your database credentials
   npx prisma generate
   npx prisma db push
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🔑 Default Login

- **Email**: admin@school.com
- **Password**: admin123
- **Role**: ADMIN

## 📱 What You Can Do

### Admin Dashboard
- ✅ View system overview and statistics
- ✅ Manage students (add, edit, delete)
- ✅ Manage teachers (assign subjects, classes)
- ✅ Manage classes (create, assign teachers)
- ✅ View and manage subjects
- ✅ Generate reports

### Key Features
- 🔐 Secure authentication with JWT
- 📊 Real-time dashboard statistics
- 📱 Responsive design (mobile-friendly)
- 🔍 Search and filter functionality
- 📤 Export/Import capabilities
- 👥 Role-based access control

## 🛠️ Development

### Running in Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Database Management
```bash
# View database
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate new migration
npx prisma migrate dev
```

## 📊 API Testing

Test the API endpoints using the provided test files:
- `backend/test-auth.html` - Authentication testing
- `backend/test-students.html` - Student management
- `backend/test-scores.html` - Score management
- `backend/test-attendance.html` - Attendance tracking

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Run `npx prisma generate`

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes on port 5000/3000

3. **CORS Errors**
   - Ensure backend is running on port 5000
   - Check CORS configuration in server.js

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version (16+)

### Getting Help

1. Check the logs:
   ```bash
   # Backend logs
   docker-compose logs backend

   # Frontend logs
   docker-compose logs frontend
   ```

2. Verify services are running:
   ```bash
   docker-compose ps
   ```

3. Restart services:
   ```bash
   docker-compose restart
   ```

## 🚀 Production Deployment

### Using Docker
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

### Manual Deployment
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
NODE_ENV=production npm start
```

## 📞 Support

- 📧 Email: support@schoolmanagement.com
- 📱 WhatsApp: +232 XX XXX XXX
- 🐛 Issues: Create GitHub issue

---

**Happy Managing! 🎓** 