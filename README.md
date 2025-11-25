# VoIP E-Learning System

A comprehensive online learning management system built with modern web technologies, featuring real-time communication, online testing, assignment management, and video conferencing capabilities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

VoIP E-Learning is a full-stack learning management system designed for educational institutions. It provides a complete solution for managing courses, classes, assignments, online tests, and real-time communication between students and teachers.

The system supports three user roles:
- **Admin**: Manages users, courses, classes, and semesters
- **Teacher**: Creates assignments, tests, manages class materials and grades students
- **Student**: Attends classes, submits assignments, takes tests, and communicates with teachers

## Features

### Core Features

**User Management**
- Multi-role authentication (Admin, Teacher, Student)
- JWT-based secure authentication
- User profile management

**Class Management**
- Semester-based class organization
- Course curriculum management
- Class scheduling with theory and practical sessions
- Student enrollment system

**Assignment System**
- Create and manage assignments
- File upload and submission
- Grading and feedback system
- Late submission tracking

**Online Testing**
- Timed online exams
- Multiple choice questions
- Automatic grading
- Multiple attempt support
- Question bank management

**Real-time Communication**
- Video conferencing with LiveKit integration
- Real-time chat with Socket.IO
- Discussion forums
- Announcement system

**Attendance System**
- Digital attendance tracking
- Session-based check-ins
- Attendance reports

**File Management**
- Google Drive integration
- Course material upload and sharing
- Assignment file submissions
- Cloudinary for image storage

### Additional Features

- Interactive discussion forums with topics and comments
- Real-time notifications
- Schedule management
- Material resource library
- Grade book and performance tracking

## Technology Stack

### Frontend

- **Framework**: React 18 with Vite
- **UI Libraries**: 
  - TailwindCSS for styling
  - Framer Motion for animations
  - Headless UI for accessible components
- **State Management**: React Hooks
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Video**: LiveKit React Components
- **Icons**: React Icons, Font Awesome
- **Notifications**: React Toastify
- **Rich Text**: React Quill
- **File Upload**: React Dropzone

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: 
  - Google Drive API
  - Cloudinary
- **Real-time**: Socket.IO
- **Video**: LiveKit Server SDK
- **File Upload**: Multer
- **Security**: 
  - bcrypt for password hashing
  - CORS for cross-origin requests
  - express-validator for input validation
- **Task Scheduling**: node-cron
- **Date Handling**: moment, moment-timezone

## Project Structure

```
VoIP E-Learning/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── assets/          # Static assets and icons
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layout/          # Layout components
│   │   ├── pages/           # Page components
│   │   │   ├── Admin/       # Admin dashboard pages
│   │   │   ├── Teacher/     # Teacher dashboard pages
│   │   │   └── Student/     # Student pages
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Utility functions
│   │   └── main.jsx         # Application entry point
│   ├── index.html
│   └── package.json
│
└── backend/                  # Node.js backend application
    ├── src/
    │   ├── config/          # Configuration files
    │   ├── controller/      # Request handlers
    │   ├── cron/            # Scheduled tasks
    │   ├── middlewares/     # Express middlewares
    │   ├── models/          # Mongoose models
    │   ├── router/          # API routes
    │   ├── service/         # Business logic layer
    │   ├── sockets/         # Socket.IO handlers
    │   └── server.js        # Application entry point
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Google Cloud Platform account (for Drive API)
- Cloudinary account
- LiveKit account (for video conferencing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd VoIP-E-Learning
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

### Configuration

#### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/voip-elearning

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# LiveKit
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
LIVEKIT_URL=wss://your-livekit-url

# Google Drive API
# Place your credentials.json in backend/src/config/
```

#### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### Google Drive API Setup

1. Create a project in Google Cloud Console
2. Enable Google Drive API
3. Create a service account and download credentials
4. Place `credentials.json` in `backend/src/config/`
5. Share your Google Drive folder with the service account email

### Running the Application

1. Start MongoDB service

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. Start the frontend development server:
```bash
cd frontend
npm run dev
```

4. Access the application:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Usage

### Default Login Credentials

After seeding the database, you can use these default credentials:

**Admin**
- Email: admin@tdtu.edu.vn
- Password: (set during database initialization)

**Teacher**
- Email: teacher@tdtu.edu.vn
- Password: (set during database initialization)

**Student**
- Email: student@tdtu.edu.vn
- Password: (set during database initialization)

### User Workflows

#### Admin Workflow
1. Login to admin dashboard
2. Manage semesters, courses, and classes
3. Create and assign teachers to classes
4. Enroll students in classes
5. Monitor system-wide statistics

#### Teacher Workflow
1. Login to teacher dashboard
2. View assigned classes
3. Create assignments and online tests
4. Upload course materials
5. Grade student submissions
6. Track attendance
7. Post announcements

#### Student Workflow
1. Login to student portal
2. View enrolled classes
3. Access course materials
4. Submit assignments
5. Take online tests
6. Check grades and feedback
7. Participate in discussions
8. Join video conferences

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register          # Register new user
POST /api/auth/login             # User login
POST /api/auth/logout            # User logout
GET  /api/auth/verify            # Verify JWT token
```

### User Management

```
GET    /api/user                 # Get all users
GET    /api/user/:id             # Get user by ID
POST   /api/user                 # Create new user
PUT    /api/user/:id             # Update user
DELETE /api/user/:id             # Delete user
```

### Class Management

```
GET    /api/class                # Get all classes
GET    /api/class/:id            # Get class by ID
POST   /api/class                # Create new class
PUT    /api/class/:id            # Update class
DELETE /api/class/:id            # Delete class
GET    /api/class/teacher/:id    # Get classes by teacher
```

### Assignment Management

```
GET    /api/assignment/class/:classId    # Get assignments by class
GET    /api/assignment/:id               # Get assignment by ID
POST   /api/assignment                   # Create assignment
PUT    /api/assignment/:id               # Update assignment
DELETE /api/assignment/:id               # Delete assignment
```

### Submission Management

```
GET    /api/submission/assignment/:id    # Get submissions by assignment
POST   /api/submission                   # Submit assignment
PUT    /api/submission/:id               # Update submission (grading)
```

### Online Test Management

```
GET    /api/online-test/class/:classId   # Get tests by class
POST   /api/online-test                  # Create online test
PUT    /api/online-test/:id              # Update test
DELETE /api/online-test/:id              # Delete test
```

### Real-time Features

#### Socket.IO Events

**Chat Namespace** (`/chat`)
```javascript
// Client to Server
socket.emit('send_message', { conversationId, content, receiverId })

// Server to Client
socket.on('receive_message', (message) => {})
socket.on('message_sent', (message) => {})
```

**Discussion Namespace** (default)
```javascript
// Join discussion
socket.emit('join_discussion', { postId })

// New comment
socket.emit('new_comment', { postId, content })
socket.on('comment_added', (comment) => {})
```

## Key Components

### Frontend Components

**Authentication**
- Login page with role-based routing
- Protected routes with authentication checks

**Dashboard Layouts**
- AdminLayout: Admin dashboard structure
- TeacherLayout: Teacher workspace
- HomeworkLayout: Student assignment view

**Reusable Components**
- Modal dialogs (Assignment, Test, Grade)
- Pagination component
- File upload with drag-and-drop
- Rich text editor
- Confirmation dialogs

### Backend Services

**Authentication Service**
- JWT token generation and validation
- Password hashing with bcrypt
- Role-based access control

**File Upload Service**
- Google Drive integration for large files
- Cloudinary for images
- Automatic file cleanup

**Chat Service**
- Real-time messaging with Socket.IO
- Conversation management
- Unread message tracking

**Test Service**
- Automated test session management
- Question randomization
- Auto-submission on timeout

## Scheduled Tasks

The system uses `node-cron` for scheduled operations:

1. **Test Status Update**: Updates online test status based on start/end times
2. **Auto Submit**: Automatically submits test sessions when time expires

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes with middleware
- CORS configuration
- Input validation
- File type and size restrictions
- XSS protection

## Performance Optimizations

- Pagination for large datasets
- Lazy loading of components
- Image optimization with Cloudinary
- Database indexing
- API response caching
- Socket.IO room-based messaging

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Known Limitations

- Maximum file upload size: 50MB
- Video conferencing requires WebRTC support
- Real-time features require stable internet connection

## Troubleshooting

### Common Issues

**Cannot connect to MongoDB**
- Ensure MongoDB service is running
- Check connection string in .env file

**File upload fails**
- Verify Google Drive API credentials
- Check folder permissions
- Ensure sufficient storage space

**Socket.IO connection errors**
- Check CORS configuration
- Verify Socket.IO server URL
- Check firewall settings

**LiveKit video not working**
- Verify LiveKit credentials
- Check browser WebRTC support
- Allow camera/microphone permissions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint configuration
- Use meaningful variable and function names
- Write comments for complex logic
- Update documentation for new features

## Future Enhancements

- Mobile application
- Advanced analytics dashboard
- AI-powered grading assistance
- Plagiarism detection
- Multi-language support
- Integration with external LMS platforms
- Advanced reporting features
- Gamification elements

## Support

For support and questions:
- Email: support@lms.com
- Create an issue on GitHub

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ton Duc Thang University for project inspiration
- Open source community for excellent libraries and tools
- LiveKit for video infrastructure
- Google for Drive API
- Cloudinary for image management

---

Built with dedication for modern education
