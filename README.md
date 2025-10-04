# CitySync - Municipal Management System

A comprehensive MERN stack application for managing municipal corporation operations, citizen complaints, and departmental workflows.

## Features

- **Three User Types:**
  - **Citizens**: Report complaints and track their status
  - **Department Heads**: Manage workers and assign tasks
  - **Workers**: Receive tasks and complete assigned work

- **Departments:**
  - Sewage Management
  - Garbage Collection
  - Road Maintenance
  - Water Supply
  - Electricity

- **Authentication System:**
  - Citizen registration with email/password
  - Department Head registration with enrollment number verification
  - Worker registration with automatic department assignment

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd CitySync
```

### 2. Install all dependencies (backend, frontend, and root)
```bash
npm run install-all
```

### 3. Environment Setup
Create a `config.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/citysync
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Seed Database
Choose one of the following seeding options:

#### Option A: Full Database Seeding (Recommended)
```bash
npm run seed
```
This will create:
- 5 departments with enrollment numbers
- Sample department heads and workers for testing
- All users have default password: `password123`

#### Option B: Departments Only
```bash
npm run seed-departments
```
This will create:
- 5 departments (sewage, garbage, road, water, electricity)
- Department head enrollment numbers (e.g., SEW001, GAR001, etc.)
- Worker enrollment numbers (e.g., SEW101, GAR101, etc.)

#### Option C: Legacy Initialization
```bash
npm run init-db
```
This creates the basic department structure (use only if needed for compatibility)

## Running the Application

### Development Mode

Start both backend and frontend simultaneously:
```bash
npm run dev
```

Or start them separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Mode
```bash
npm run build
cd backend && npm start
```

## Usage

### For Citizens:
1. Register with email, password, name, phone, and address
2. Login to access the citizen dashboard
3. Submit complaints and track their status

### For Department Heads:
1. Use enrollment numbers: SEW001, SEW002, GAR001, GAR002, ROD001, ROD002, WAT001, WAT002, ELE001, ELE002
2. Register with enrollment number, password, and personal details
3. Automatically assigned to the corresponding department
4. View workers under their department
5. Assign tasks to workers

### For Workers:
1. Use enrollment numbers: SEW101-SEW105, GAR101-GAR105, ROD101-ROD105, WAT101-WAT105, ELE101-ELE105
2. Register with enrollment number, password, and personal details
3. Automatically assigned to the corresponding department and department head
4. View assigned tasks and department head information

## API Endpoints

### Authentication
- `POST /api/auth/signup/citizen` - Citizen registration
- `POST /api/auth/signup/head` - Department head registration
- `POST /api/auth/signup/worker` - Worker registration
- `POST /api/auth/login` - Login for all user types
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users/workers` - Get workers under department head
- `GET /api/users/department-info` - Get department information
- `GET /api/users/assigned-head` - Get assigned head info for workers

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create new department

## Database Schema

### Users Collection
```javascript
{
  userType: "citizen" | "departmentHead" | "worker",
  email: String,
  password: String (hashed),
  enrollmentNumber: String, // for heads and workers
  department: String, // for heads and workers
  name: String,
  phone: String,
  address: String,
  assignedHead: ObjectId, // for workers
  isActive: Boolean,
  createdAt: Date
}
```

### Departments Collection
```javascript
{
  name: String, // sewage, garbage, road, water, electricity
  displayName: String,
  description: String,
  headEnrollmentNumbers: [String],
  workerEnrollmentNumbers: [String],
  isActive: Boolean,
  createdAt: Date
}
```

## Enrollment Numbers

### Department Heads:
- **Sewage**: SEW001, SEW002
- **Garbage**: GAR001, GAR002
- **Road**: ROD001, ROD002
- **Water**: WAT001, WAT002
- **Electricity**: ELE001, ELE002

### Workers:
- **Sewage**: SEW101, SEW102, SEW103, SEW104, SEW105
- **Garbage**: GAR101, GAR102, GAR103, GAR104, GAR105
- **Road**: ROD101, ROD102, ROD103, ROD104, ROD105
- **Water**: WAT101, WAT102, WAT103, WAT104, WAT105
- **Electricity**: ELE101, ELE102, ELE103, ELE104, ELE105

## Technology Stack

- **Frontend**: React.js, Material-UI, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Future Enhancements

- Complaint submission and tracking system
- Task assignment and management
- Photo upload for completed tasks
- Real-time notifications
- Analytics dashboard
- Mobile responsiveness
- Location services integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.


## Collaborators
1. Rishabh Jain
2. Samar Burnwal
