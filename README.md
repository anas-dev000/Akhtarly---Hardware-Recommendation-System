# Akhtarly Project - Complete Documentation

## 🎯 Project Overview

**Akhtarly** is a comprehensive backend API service built with Node.js and Express.js that provides hardware component information and program management capabilities. The system manages CPUs, GPUs, programs, and user authentication with role-based access control.

### 🏗️ Architecture
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control (RBAC)

---

## 📁 Project Structure

```
Akhtarly/
├── 📄 index.js                    # Main application entry point
├── 📄 package.json               # Dependencies and scripts
├── 📄 .gitignore                 # Git ignore rules
├── 📄 README.md                  # Project description
├── 📁 controllers/               # Business logic layer
│   ├── 📄 authController.js      # Authentication & password reset
│   ├── 📄 cpuController.js       # CPU management
│   ├── 📄 gpuController.js       # GPU management
│   ├── 📄 programController.js   # Program management
│   ├── 📄 favoriteController.js   # User favorites management
│   └── 📄 userController.js      # User management
├── 📁 middlewares/               # Middleware functions
│   ├── 📄 auth.js                # JWT authentication & authorization
│   ├── 📄 globalErrorhandler.js  # Global error handling
│   └── 📄 objectIdValidation.js  # MongoDB ObjectId validation
├── 📁 models/                    # Database models (Mongoose schemas)
│   ├── 📄 cpuModel.js            # CPU schema
│   ├── 📄 gpuModel.js            # GPU schema
│   ├── 📄 programModel.js        # Program schema
│   └── 📄 userModel.js           # User schema
├── 📁 routers/                   # API route definitions
│   ├── 📄 cpuRouter.js           # CPU routes
│   ├── 📄 gpuRouter.js           # GPU routes
│   ├── 📄 programRouter.js       # Program routes
│   └── 📄 userRouter.js          # User routes
└── 📁 Utils/                     # Utility functions
    ├── 📄 apiError.js            # API error handling
    ├── 📄 asyncErrorHandler.js   # Async error wrapper
    ├── 📄 CustomError.js         # Custom error classes
    ├── 📄 email.js               # Email utilities
    ├── 📄 queryProcesses.js      # Query processing utilities
    └── 📄 rules.js               # Validation rules
```

---

## 🛠️ Technology Stack

### Core Technologies
- **Node.js** v18+ - JavaScript runtime
- **Express.js** v4.18+ - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** v8.1+ - MongoDB ODM

### Dependencies
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token handling
- **nodemailer** - Email sending
- **validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

---

## 🔐 Authentication & Authorization

### JWT Authentication
- **Token Location**: Authorization header
- **Token Format**: `Bearer <token>`
- **Secret Key**: Environment variable `secret_str`

### Role-Based Access Control (RBAC)
- **ADMIN**: Full system access
- **OWNER**: Owner-level access
- **USER**: Standard user access

---

## 📊 Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed, min 8 chars),
  rule: String (enum: ADMIN, OWNER, USER),
  passwordResetToken: String,
  passwordResetTokenExpires: Date
}
```

### CPU Model
```javascript
{
  Type: String (default: "CPU"),
  PartNumber: String,
  Brand: String (enum: Intel, AMD),
  Model: String (required),
  rank: Number,
  Benchmark: Number (required),
  Samples: Number,
  URL: String (must start with https://cpu.userbenchmark.com)
}
```

### GPU Model
```javascript
{
  Type: String (default: "GPU"),
  PartNumber: String,
  Brand: String (enum: Nvidia, Asus, Gigabyte, MSI, Zotac),
  Model: String (required),
  rank: Number (required),
  Benchmark: Number (required),
  Samples: Number,
  URL: String (must start with https://gpu.userbenchmark.com)
}
```

### Program Model
```javascript
{
  Software_Game: String (required),
  MinCPU: String (required),
  MinGPU: String (required),
  MinRAM: Number (required),
  MaxRAM: Number (required),
  MaxCPU: String (required),
  MaxGPU: String (required),
  MaxRAM: Number (required),
  STRG: Number (required)
}
```

---

## 🚀 API Endpoints

### Authentication Routes (`/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /forgotPassword` - Password reset request
- `PATCH /resetPassword/:token` - Password reset

### User Management (`/auth`)
- `GET /allUsers` - Get all users (ADMIN/OWNER only)
- `GET /profile` - Get user profile
- `PATCH /changeRule/:id` - Change user role (OWNER only)

### CPU Management (`/api/cpus/`)
- `GET /` - Get all CPUs (with pagination, filtering, sorting)
- `POST /addCpu` - Create new CPU (ADMIN/OWNER only)
- `PUT /editCpu/:id` - Update CPU (ADMIN/OWNER only)
- `DELETE /deleteCpu/:id` - Delete CPU (ADMIN/OWNER only)

### GPU Management (`/api/gpus/`)
- `GET /` - Get all GPUs (with pagination, filtering, sorting)
- `POST /createGpu` - Create new GPU (ADMIN/OWNER only)
- `PUT /editGpu/:id` - Update GPU (ADMIN/OWNER only)
- `DELETE /deleteGpu/:id` - Delete GPU (ADMIN/OWNER only)

### Program Management (`/api/programs/`)
- `GET /` - Get all programs (with pagination, filtering, sorting)
- `POST /createProgram` - Create new program (ADMIN/OWNER only)
- `POST /sendPrograms` - Get recommended hardware for programs
- `PUT /editProgram/:id` - Update program (ADMIN/OWNER only)
- `DELETE /deleteProgram/:id` - Delete program (ADMIN/OWNER only)

---

## 🔍 Query Features

### Supported Query Parameters
- **Filtering**: Field-based filtering with comparison operators
- **Sorting**: `sort` parameter for sorting results
- **Pagination**: `page`, `limit` parameters
- **Substring Search**: Support for partial string matching
- **Field Selection**: Select specific fields to return

### Example Queries
```
GET /api/cpus/?Brand=Intel&sort=Benchmark&page=1&limit=10
GET /api/gpus/?Model=RTX&sort=-Benchmark
GET /api/programs/?Software_Game=Adobe
```

---

## 📧 Email Configuration

### Password Reset Email
- **Subject**: "Password change request received"
- **Token Validity**: 10 minutes
- **Reset URL**: Generated dynamically based on request

---

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds 12
- **JWT Tokens**: Secure token generation and validation
- **CORS**: Cross-origin resource sharing enabled
- **Input Validation**: Comprehensive validation on all inputs
- **Error Handling**: Global error handler with detailed messages
- **MongoDB Injection Prevention**: Safe query construction

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB v5+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env file with your MongoDB connection string and JWT secret

# Start the server
npm start
```

### Environment Variables
```bash
# .env file
connect_url=mongodb://localhost:27017/akhtarly
secret_str=your_jwt_secret_key
PORT=8000
```

---

## 🧪 Testing

### Manual Testing
- Use Postman or similar API testing tool
- Test all CRUD operations
- Verify authentication and authorization
- Test error handling and edge cases

### Example API Calls

#### User Registration
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","rule":"USER"}'
```

#### Get All CPUs
```bash
curl -X GET http://localhost:8000/api/cpus/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📈 Performance Considerations

- **Database Indexing**: Indexed on frequently queried fields
- **Pagination**: Default limit of 10 items per page
- **Query Optimization**: Efficient query building with Mongoose
- **Caching**: Can be implemented with Redis for better performance

---

## 🔧 Development Tools

### Linting & Formatting
- **ESLint**: Code linting with Airbnb config
- **Prettier**: Code formatting

### Development Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server (if configured)
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

---

## 🐛 Error Handling

### Error Types
- **ValidationError**: Mongoose validation errors
- **ApiError**: Custom API errors
- **AuthenticationError**: JWT/authorization errors
- **DatabaseError**: MongoDB connection/query errors

### Error Response Format
```json
{
  "state": "Fail",
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

---

## 📋 Future Enhancements

- **Caching Layer**: Redis integration
- **API Rate Limiting**: Per-user rate limiting
- **API Documentation**: Swagger/OpenAPI integration
- **Testing Suite**: Unit and integration tests
- **Docker Support**: Containerization
- **CI/CD Pipeline**: Automated testing and deployment
- **Monitoring**: Application performance monitoring
- **Logging**: Structured logging with Winston

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

ISC License - See LICENSE file for details

---

## 📞 Support

For support, please contact the development team or create an issue in the project repository.
