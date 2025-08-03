# School Management System

A comprehensive web-based school management system built for Sierra Leone schools with modern UI and robust backend functionality.

## 🚀 Features

### Core Functionality
- **User Management**: Admin, Teachers, Students, Parents
- **Student Management**: CRUD operations, enrollment, profiles
- **Teacher Management**: Assignment, subject allocation, profiles
- **Class Management**: Academic classes, teacher assignments
- **Subject Management**: Course catalog, curriculum tracking
- **Attendance Tracking**: Daily attendance marking and reporting
- **Score Management**: Grade entry, report cards, academic tracking
- **Fee Management**: Payment tracking, financial records
- **Reports & Analytics**: Comprehensive reporting system

### Technical Features
- **Modern UI**: React with Tailwind CSS
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live data synchronization
- **Role-based Access**: Secure permission system
- **JWT Authentication**: Secure login system
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful backend with Express.js

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern UI framework
- **React Router DOM 7.7.1** - Client-side routing
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **PostgreSQL** - Relational database
- **Prisma 6.13.0** - Database ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **PostgreSQL** database
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd school-management-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/school_management_db"
# JWT_SECRET="your-super-secret-jwt-key"
# PORT=5000

# Set up database
npx prisma generate
npx prisma db push

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Database Setup

Make sure your PostgreSQL database is running and create a database:

```sql
CREATE DATABASE school_management_db;
```

## 🔧 Environment Configuration

### Backend (.env)
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/school_management_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 👥 Default Users

The system comes with demo credentials:

### Admin User
- **Email**: admin@school.com
- **Password**: admin123
- **Role**: ADMIN

## 📱 Usage

### Admin Dashboard
1. Login with admin credentials
2. Navigate through different sections:
   - **Dashboard**: Overview and statistics
   - **Students**: Manage student records
   - **Teachers**: Manage teacher profiles
   - **Classes**: Academic class management
   - **Subjects**: Course catalog
   - **Reports**: Generate reports
   - **Settings**: System configuration

### Key Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Changes reflect immediately
- **Search & Filter**: Find records quickly
- **Export/Import**: Data management tools
- **Role-based Access**: Secure permission system

## 🗄️ Database Schema

The system uses a comprehensive database schema with the following main entities:

- **Users**: Authentication and user profiles
- **Students**: Student information and academic records
- **Teachers**: Teacher profiles and assignments
- **Classes**: Academic classes and enrollment
- **Subjects**: Course catalog and curriculum
- **Scores**: Academic performance tracking
- **Attendance**: Daily attendance records
- **Fees**: Financial management
- **School Settings**: System configuration

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-based Access Control**: Granular permissions
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Prisma ORM protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/users?role=TEACHER` - Get all teachers
- `POST /api/users` - Create new teacher
- `PUT /api/users/:id` - Update teacher
- `DELETE /api/users/:id` - Delete teacher

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Scores
- `POST /api/scores/enter` - Enter student scores
- `GET /api/scores/student/:id` - Get student scores
- `GET /api/scores/class/:classId` - Get class scores

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/class/:classId` - Get class attendance
- `GET /api/attendance/student/:studentId` - Get student attendance

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   npm start
   ```

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: Heroku, DigitalOcean, or AWS EC2
- **Database**: AWS RDS, DigitalOcean Managed Databases, or Railway

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Mobile app integration
- [ ] WhatsApp/SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Bulk import/export functionality
- [ ] Multi-language support
- [ ] Advanced reporting features
- [ ] Parent portal
- [ ] Student portal
- [ ] Teacher portal

## 📞 Contact

For more information about this school management system, please contact the development team.

---

**Built with ❤️ for Sierra Leone Schools** 