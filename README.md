# VoIP E-Learning System

A modern, full-featured Learning Management System (LMS) with integrated VoIP communication capabilities, real-time video conferencing, and comprehensive educational tools built for Ton Duc Thang University.

![E-Learning System](https://res.cloudinary.com/dsj6sba9f/image/upload/v1745247841/c085ad076c442c8191e6b7f48ef59aad_k7izor.jpg)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration-details)
- [API Documentation](#api-documentation)
- [Socket.IO Events](#socketio-events)
- [Database Schema](#database-schema)
- [Usage Guide](#usage-guide)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

VoIP E-Learning is a comprehensive educational platform that combines traditional LMS features with advanced real-time communication capabilities. The system provides seamless integration of course management, online assessments, video conferencing, VoIP calling, collaborative learning tools, and intelligent document search powered by AI embeddings.

### Key Highlights

- **Real-time VoIP Communication**: Direct SIP-based calling between students and teachers using SIP.js
- **Video Conferencing**: LiveKit-powered virtual classrooms with interactive whiteboard (Tldraw)
- **AI-Powered Search**: Vector similarity search using embeddings from Gemini AI for intelligent document retrieval
- **Online Testing**: Advanced testing system with auto-grading, multiple attempts, and scheduled activation
- **Assignment Management**: Complete workflow from creation to submission and grading
- **Discussion Forums**: Topic-based discussions with nested comments and real-time updates
- **File Management**: Google Drive integration for materials and Cloudinary for images
- **Live Chat**: Socket.IO powered real-time messaging with conversation tracking
- **Meeting Intelligence**: AI-powered meeting transcription and summarization using Gemini 2.0 Flash

## ✨ Key Features

### 📚 Educational Features

#### Class & Course Management
- **Semester-based Organization**: Classes organized by academic terms (HK1-2024/2025, HK2-2024/2025)
- **Multi-class Enrollment**: Students can enroll in multiple classes per semester
- **Course Materials Library**: Google Drive integration for uploading and sharing resources
- **Schedule Management**: Support for theory and practice sessions with day/shift scheduling
- **Attendance Tracking**: Digital check-in system with session-based attendance

#### Online Testing System
- **Test Creation**: Flexible configuration with title, description, time limits, and attempt limits
- **Question Bank**: Multiple-choice questions with import from .docx files using Mammoth.js
- **Auto-Grading**: Immediate results calculation with detailed feedback
- **Test Sessions**: Individual test instances tracking student attempts and timing
- **Scheduled Tests**: Automatic lifecycle management (not_started → ongoing → ended)
- **Cron Jobs**: Automated status updates and forced submission on timeout
- **Multiple Attempts**: Configure maximum attempts per student with best score tracking

#### Assignment Management
- **Create Assignments**: With deadlines, descriptions, and file attachments
- **File Upload**: Via Google Drive API with automatic permission management
- **Submission Tracking**: Monitor submission status with late detection
- **Grading System**: Numeric grades with text feedback
- **File Validation**: Type and size restrictions for submissions

#### AI-Powered Document Search
- **Vector Embeddings**: Documents embedded using Google Generative AI (Gemini)
- **Semantic Search**: Finds relevant documents based on meaning, not just keywords
- **Multi-field Embeddings**: Separate embeddings for title, description, tags, and level
- **Weighted Similarity**: Combines multiple embedding similarities for accurate results
- **Hybrid Search**: Combines vector similarity with traditional filters (tags, level)

### 💬 Communication Features

#### VoIP Calling (SIP.js Integration)
- **Direct Calling**: Student-to-teacher voice calls via WebRTC
- **Session Management**: Proper handling of incoming, outgoing, and active calls
- **Call States**: Real-time state tracking (idle, calling, in-call, terminated)
- **Audio Streaming**: Remote audio playback through HTML5 audio elements
- **STUN/TURN Servers**: Configured for NAT traversal
  ```
  STUN: stun.l.google.com:19302
  TURN: webrtc.voipelearning.shop:3478 (UDP/TCP)
  TURNS: webrtc.voipelearning.shop:5349 (TLS)
  ```

#### Video Conferencing (LiveKit)
- **Virtual Classrooms**: Teacher-initiated live sessions with unique room IDs
- **Screen Sharing**: Built-in presentation capabilities
- **Interactive Whiteboard**: Tldraw-based collaborative drawing tool
- **Teacher Controls**: Mute all participants, toggle whiteboard, end session
- **Participant Management**: Real-time tracking with automatic cleanup
- **Auto-reconnect**: Resilient connection handling with token refresh
- **Session Recording**: Recording capabilities with AI-powered transcription and summarization
- **Meeting Intelligence**: 
  - Automatic transcription of recorded sessions
  - AI-generated summaries with key points
  - Smart title generation based on content
  - Markdown-formatted meeting notes

#### Real-time Chat (Socket.IO)
- **Personal Chat**: Direct messaging with admin and teachers
- **Conversation Management**: Persistent chat history with MongoDB
- **Socket.IO Authentication**: JWT-based secure connections on `/chat` namespace
- **Read Receipts**: Message read status tracking
- **Unread Counter**: Real-time notification badges
- **Message Delivery**: Optimistic updates with server confirmation

#### Discussion Forums
- **Topic-based Discussions**: Organize conversations by subject areas
- **Nested Comments**: Reply to posts and create threaded discussions
- **Real-time Updates**: Live comment notifications via Socket.IO
- **Rich Text Support**: Formatted post content with React Quill
- **Comment Counter**: Aggregate comment counts per post
- **Post Analytics**: Track engagement with view counts

### 👥 User Roles & Permissions

#### Admin
- Complete system management dashboard
- User CRUD operations (students, teachers, admins)
- Course and class creation with semester assignment
- Class enrollment management (bulk and individual)
- Semester lifecycle management
- Document library management with AI search
- System-wide analytics and reporting
- Chat support interface for all users
- Topic management for discussion forums

#### Teacher
- Assigned class management with detailed overview
- Assignment creation with Google Drive integration
- Online test design with question bank import
- Material uploads to shared Drive folders
- Submission grading with detailed feedback
- Attendance tracking per session
- Announcements and notifications to class
- Video conference hosting with whiteboard and screen sharing
- Recording management with AI summaries
- Student chat support
- Discussion forum moderation
- Real-time class statistics

#### Student
- View enrolled classes per semester
- Submit assignments before deadlines with file uploads
- Take scheduled online tests with timer
- Access course materials and resources
- Participate in discussion forums (post, comment, vote)
- Join video conferences when active
- VoIP calling to assigned teachers
- Real-time chat with admin/teachers
- View grades and feedback
- Download meeting recordings and transcripts
- Search document library with AI-powered semantic search

## 🛠 Technology Stack

### Frontend

**Core Framework**
- React 18.3.1 with Vite 5.4.2
- React Router DOM 6.28.0

**UI & Styling**
- TailwindCSS 3.4.17 (utility-first CSS)
- Framer Motion 11.15.0 (animations)
- Headless UI 2.2.0 (accessible components)
- React Icons 5.4.0
- Lucide React 0.469.0

**Communication & Real-time**
- Socket.IO Client 4.8.1 (chat & discussions)
- SIP.js 0.21.2 (VoIP calling)
- @livekit/components-react 2.7.3 (video conferencing)
- @livekit/components-styles 1.1.4

**Forms & Validation**
- React Hook Form 7.54.2
- Zod 3.24.1 (schema validation)

**Media & Files**
- React Dropzone 14.3.5 (drag-and-drop uploads)
- React Quill 2.0.0 (rich text editor)
- Axios 1.7.9 (HTTP client)

**UI Components**
- React Toastify 11.0.3 (notifications)
- Tippy.js 6.3.7 (tooltips)
- Clsx 2.1.1 (conditional classes)

**Whiteboard**
- @tldraw/tldraw 2.4.0 (collaborative drawing)

### Backend

**Runtime & Framework**
- Node.js 20.x
- Express 4.21.2

**Database**
- MongoDB 6.12.0
- Mongoose 8.9.3 (ODM)

**Authentication & Security**
- jsonwebtoken 9.0.2 (JWT auth)
- bcrypt 5.1.1 (password hashing)
- express-validator 7.2.1 (input validation)
- CORS 2.8.5 (cross-origin requests)

**Real-time Communication**
- Socket.IO 4.8.1 (bidirectional events)
- LiveKit Server SDK 2.10.1 (video rooms)

**AI & Machine Learning**
- @google/generative-ai 0.21.0 (Gemini AI for embeddings and summarization)
- Vector Similarity Calculations (custom implementation)

**File Storage & Processing**
- Multer 1.4.5-lts.1 (file uploads)
- googleapis 144.0.0 (Google Drive integration)
- Cloudinary 2.6.0 (image storage)
- Mammoth 1.8.0 (Word document parsing)
- fs-extra 11.2.0 (enhanced file operations)

**Task Scheduling**
- node-cron 3.0.3 (scheduled jobs)

**Utilities**
- Moment.js 2.30.1 (date/time)
- Moment-timezone 0.5.46 (timezone handling)
- Crypto (native, UUID generation)

**Development**
- Nodemon 3.1.9 (auto-restart)
- ESLint (code quality)

## 📁 Project Structure

```
VoIP E-Learning/
├── frontend/
│   ├── src/
│   │   ├── assets/              # Images, icons, global styles
│   │   ├── components/
│   │   │   ├── Chat/           # Chat components
│   │   │   │   ├── ChatWithAdmin.jsx
│   │   │   │   └── ChatWithTeacher.jsx
│   │   │   ├── Common/         # Shared components
│   │   │   │   ├── NavBar.jsx
│   │   │   │   ├── SupportedWidget.jsx
│   │   │   │   └── DropdownButton.jsx
│   │   │   ├── Modals/         # Dialog components
│   │   │   │   ├── AddQuestionModal.jsx
│   │   │   │   ├── TestModal.jsx
│   │   │   │   ├── AddStudentModal.jsx
│   │   │   │   └── AssignmentModal.jsx
│   │   │   ├── UI/             # Reusable UI elements
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── TextInput.jsx
│   │   │   │   ├── LoaderOverlay.jsx
│   │   │   │   └── ClassNavigation.jsx
│   │   │   └── Voip/           # VoIP & Video components
│   │   │       ├── ConferenceRoom.jsx
│   │   │       ├── MessageCall.jsx
│   │   │       ├── WhiteboardTldraw.jsx
│   │   │       └── TeacherControls.jsx
│   │   ├── context/            # React contexts
│   │   │   └── LoadingContext.jsx
│   │   ├── hooks/              # Custom hooks
│   │   │   └── useAuth.js
│   │   ├── layout/             # Layout wrappers
│   │   │   ├── HomeworkLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── TeacherLayout.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Admin/
│   │   │   │   ├── ManageClassDetails.jsx
│   │   │   │   ├── ManageUsers.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── DocumentLibrary.jsx
│   │   │   ├── Teacher/
│   │   │   │   ├── ClassDetails.jsx
│   │   │   │   ├── GradeSubmissions.jsx
│   │   │   │   └── Recordings.jsx
│   │   │   ├── Student/
│   │   │   │   ├── ClassDetails.jsx
│   │   │   │   ├── TakeTest.jsx
│   │   │   │   └── SearchDocuments.jsx
│   │   │   ├── Login.jsx
│   │   │   └── LMS404Page.jsx
│   │   ├── services/           # API service layer
│   │   │   ├── authService.js
│   │   │   ├── chatService.js
│   │   │   ├── classService.js
│   │   │   ├── enrollmentService.js
│   │   │   ├── roomService.js
│   │   │   ├── sipClientService.js
│   │   │   ├── documentService.js
│   │   │   └── http.js
│   │   ├── utils/              # Helper functions
│   │   │   └── formatTime.js
│   │   └── main.jsx            # App entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── backend/
    ├── src/
    │   ├── config/
    │   │   ├── db.js              # MongoDB connection
    │   │   ├── credentials.json    # Google Drive service account
    │   │   └── googleConfig.js     # OAuth2 client
    │   ├── controller/
    │   │   ├── authController.js
    │   │   ├── chatController.js
    │   │   ├── classController.js
    │   │   ├── testOnlineController.js
    │   │   ├── voipController.js
    │   │   ├── documentController.js
    │   │   ├── postController.js
    │   │   └── [others...]
    │   ├── cron/
    │   │   ├── updateOnlineTest.js    # Test status automation
    │   │   └── submitTestSession.js   # Auto-submit timeout
    │   ├── middlewares/
    │   │   ├── auth.js                # JWT verification
    │   │   ├── errorHandler.js
    │   │   └── logger.js
    │   ├── model/
    │   │   ├── User.js
    │   │   ├── Class.js
    │   │   ├── Assignment.js
    │   │   ├── OnlineTest.js
    │   │   ├── TestQuestion.js
    │   │   ├── TestSession.js
    │   │   ├── Conversation.js
    │   │   ├── Message.js
    │   │   ├── Document.js           # AI-searchable documents
    │   │   ├── Post.js
    │   │   ├── Comment.js
    │   │   └── [others...]
    │   ├── router/
    │   │   ├── authRouter.js
    │   │   ├── chatRouter.js
    │   │   ├── classRouter.js
    │   │   ├── voipRouter.js
    │   │   ├── livekitRouter.js
    │   │   ├── testOnlineRouter.js
    │   │   ├── documentRouter.js
    │   │   ├── postRouter.js
    │   │   └── [others...]
    │   ├── service/
    │   │   ├── authService.js
    │   │   ├── chatService.js
    │   │   ├── driveService.js        # Google Drive API
    │   │   ├── postService.js
    │   │   ├── testService.js
    │   │   ├── aiService.js           # Gemini AI integration
    │   │   └── documentService.js
    │   ├── sockets/
    │   │   ├── chatSocket.js          # Chat namespace
    │   │   └── discussionSocket.js    # Discussion events
    │   ├── utils/
    │   │   └── VectorSimilarity.js    # Cosine similarity calculations
    │   └── server.js                  # Express server
    ├── Dockerfile
    └── package.json
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js**: v20.x or higher
- **MongoDB**: v6.x or higher
- **Google Cloud Project**: For Drive API and Gemini AI
- **Cloudinary Account**: For image storage
- **LiveKit Account**: For video conferencing
- **SIP Server**: For VoIP functionality (WebRTC-compatible)

### Backend Setup

1. **Clone and navigate**
```bash
git clone <repository-url>
cd VoIP-E-Learning/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**

Create `.env` file:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/voip-elearning

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# LiveKit
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
LIVEKIT_URL=wss://your-livekit-instance.livekit.cloud

# Google AI (Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Google Services Setup**

**Google Drive API:**
- Create project in [Google Cloud Console](https://console.cloud.google.com)
- Enable Google Drive API
- Create service account
- Download credentials JSON
- Place as `src/config/credentials.json`
- Share Drive folder with service account email

**Gemini AI:**
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create API key
- Add to `.env` as `GEMINI_API_KEY`

5. **Start server**
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

Server runs on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_WEBSOCKET_URL=ws://localhost:5000
VITE_DOMAIN=voipelearning.shop
```

4. **Start development server**
```bash
npm run dev
```

Application runs on: `http://localhost:5173`

## ⚙️ Configuration Details

### VoIP Configuration (sipClientService.js)

```javascript
const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    {
        urls: [
            "turn:webrtc.voipelearning.shop:3478?transport=udp",
            "turn:webrtc.voipelearning.shop:3478?transport=tcp",
            "turns:webrtc.voipelearning.shop:5349"
        ],
        username: "any",
        credential: "31a2313d897a7ca91b21486dac0c3184f7e3a673cacbe465b57687668fd8af43"
    }
];
```

### AI Configuration

**Gemini Model**: `gemini-2.0-flash-exp`
- Used for document embeddings (1536 dimensions)
- Meeting transcription and summarization
- Structured JSON output generation

**Vector Similarity**:
- Cosine similarity for document search
- Weighted combination: 40% title, 30% description, 20% tags, 10% level
- Threshold: 0.3 minimum similarity score

### CORS Configuration

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://voip-e-learning-1.onrender.com",
  "https://meet.livekit.io",
  "http://localhost:5000",
];
```

### Socket.IO Namespaces

- **Chat Namespace**: `/chat` - JWT-authenticated messaging
- **Default Namespace**: `/` - Discussion forums and general events

### Google Drive Configuration

```javascript
const PARENT_FOLDER_ID = "1nQTKksCVedKtt0hJqWyZQ8T57EMmjR0P";
```

## 📡 API Documentation

### Authentication

```http
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login (returns JWT)
POST   /api/auth/logout         # Logout
GET    /api/auth/verify         # Verify token validity
```

### User Management

```http
GET    /api/user                # Get all users (admin only)
GET    /api/user/:id            # Get user by ID
POST   /api/user                # Create user (admin only)
PUT    /api/user/:id            # Update user
DELETE /api/user/:id            # Delete user (admin only)
```

### Class & Enrollment

```http
GET    /api/class                        # Get all classes
GET    /api/class/:id                    # Get class details
POST   /api/class                        # Create class (admin)
PUT    /api/class/:id                    # Update class
DELETE /api/class/:id                    # Delete class
GET    /api/class/teacher/:teacherId     # Get teacher's classes

GET    /api/enrollment/student/:studentId  # Get student enrollments
POST   /api/enrollment                     # Enroll student
DELETE /api/enrollment/:id                 # Remove enrollment
```

### Online Tests

```http
GET    /api/online-test/class/:classId   # Get tests for class
GET    /api/online-test/:id              # Get test details
POST   /api/online-test                  # Create test
PUT    /api/online-test/:id              # Update test
DELETE /api/online-test/:id              # Delete test

GET    /api/test-question/test/:testId   # Get test questions
POST   /api/test-question                # Add question
POST   /api/upload-question              # Bulk import from .docx

POST   /api/test-session                 # Start test session
GET    /api/test-session/:id             # Get session details
POST   /api/attempt                      # Submit answers
GET    /api/attempt/session/:sessionId   # Get attempt history
```

### Assignments

```http
GET    /api/assignment/class/:classId    # Get assignments
GET    /api/assignment/:id               # Get assignment details
POST   /api/assignment                   # Create assignment
PUT    /api/assignment/:id               # Update assignment
DELETE /api/assignment/:id               # Delete assignment

POST   /api/submission                   # Submit assignment
GET    /api/submission/assignment/:id    # Get submissions
PUT    /api/submission/:id               # Grade submission
```

### AI Document Search

```http
GET    /api/document                     # Get all documents
GET    /api/document/:id                 # Get document by ID
POST   /api/document                     # Create document with embedding
PUT    /api/document/:id                 # Update document
DELETE /api/document/:id                 # Delete document
POST   /api/document/search              # AI-powered semantic search
```

**Search Request Body:**
```json
{
  "query": "machine learning algorithms",
  "filters": {
    "tags": ["AI", "Python"],
    "level": "Advanced"
  },
  "limit": 10
}
```

**Search Response:**
```json
{
  "success": true,
  "data": [
    {
      "score": 0.85,
      "data": {
        "_id": "...",
        "title": "Introduction to Neural Networks",
        "description": "...",
        "tags": ["AI", "Deep Learning"],
        "level": "Advanced",
        "link": "https://..."
      }
    }
  ]
}
```

### Chat

```http
GET    /api/chat/:conversationId         # Get conversation
POST   /api/chat                         # Create/get conversation
GET    /api/chat/:conversationId/messages  # Get messages
POST   /api/chat/:conversationId/read    # Mark as read
GET    /api/chat/:userId/unread-count    # Get unread count
GET    /api/chat/admin/:adminId/users    # Admin conversations
```

### Video Conferencing (LiveKit)

```http
POST   /api/room/create                  # Create conference room
GET    /api/room/:roomId                 # Get room details
POST   /api/room/:roomId/start           # Start conference
POST   /api/room/:roomId/end             # End conference
POST   /api/livekit/token                # Get LiveKit access token
```

### Meeting Intelligence

```http
POST   /api/meeting/process              # Process recorded meeting
```

**Process Request Body:**
```json
{
  "fileUrl": "https://storage.url/recording.mp4",
  "roomName": "class-123-session-1"
}
```

**Process Response:**
```json
{
  "success": true,
  "data": {
    "transcript": "Full transcript...",
    "summaryTitle": "Introduction to Data Structures",
    "summary": "### Main Topics\n- Arrays\n- Linked Lists\n..."
  }
}
```

### File Management

```http
POST   /api/drive/upload                 # Upload to Google Drive
DELETE /api/drive/:fileId                # Delete from Drive
POST   /api/file/upload                  # Upload to Cloudinary
```

### Discussion Forum

```http
GET    /api/post                         # Get forum posts
GET    /api/post/:id                     # Get post with comments
POST   /api/post                         # Create post
PUT    /api/post/:id                     # Update post
DELETE /api/post/:id                     # Delete post

POST   /api/comment                      # Add comment
DELETE /api/comment/:id                  # Delete comment

GET    /api/topic                        # Get all topics
POST   /api/topic                        # Create topic (admin)
```

## 🔌 Socket.IO Events

### Chat Namespace (`/chat`)

**Client → Server**
```javascript
// Send message
socket.emit('send_message', {
  content: string,
  conversationId: string,
  receiverId: string
});
```

**Server → Client**
```javascript
// Receive incoming message
socket.on('receive_message', (message) => {
  // message: { _id, sender, content, conversationId, createdAt }
});

// Confirmation of sent message
socket.on('message_sent', (finalMessage) => {
  // finalMessage: complete message object from DB
});

// Error handling
socket.on('error', (error) => {
  // error: { message: string }
});
```

### Discussion Namespace (default `/`)

**Client → Server**
```javascript
// Join discussion room
socket.emit('join_discussion', { postId: string });

// Post new comment
socket.emit('new_comment', { 
  postId: string, 
  content: string, 
  parentCommentId?: string 
});
```

**Server → Client**
```javascript
// New comment notification
socket.on('comment_added', (comment) => {
  // comment: full comment object
});
```

## 🗄 Database Schema

### Key Collections

**Users**
```javascript
{
  email: String (unique, indexed),
  password: String (hashed),
  full_name: String,
  role: Enum ['admin', 'teacher', 'student'],
  phone: String,
  address: String,
  avatar: String (Cloudinary URL),
  createdAt: Date,
  updatedAt: Date
}
```

**Classes**
```javascript
{
  name: String,
  course: ObjectId (ref: Course),
  teacher: ObjectId (ref: User),
  semester: ObjectId (ref: Semester),
  schedule: [{
    dayOfWeek: Number (2-7),
    shift: Number (1-4)
  }],
  status: Enum ['active', 'inactive'],
  createdAt: Date,
  updatedAt: Date
}
```

**Documents** (AI-Searchable)
```javascript
{
  title: String (indexed),
  description: String,
  tags: [String] (indexed),
  level: Enum ['Beginner', 'Intermediate', 'Advanced'],
  link: String (Google Drive URL),
  embedding: [Number] (1536 dimensions),
  titleEmbedding: [Number],
  descriptionEmbedding: [Number],
  tagsEmbedding: [Number],
  levelEmbedding: [Number],
  createdAt: Date,
  updatedAt: Date
}
```

**OnlineTests**
```javascript
{
  title: String,
  description: String,
  class: ObjectId (ref: Class),
  start: Date,
  end: Date,
  time: Number (minutes),
  attempts: Number,
  status: Enum ['not_started', 'ongoing', 'ended'],
  createdAt: Date,
  updatedAt: Date
}
```

**TestSessions**
```javascript
{
  student: ObjectId (ref: User),
  test: ObjectId (ref: OnlineTest),
  startTime: Date,
  endTime: Date,
  status: Enum ['in_progress', 'submitted', 'auto_submitted'],
  attempts: Number,
  score: Number,
  bestScore: Number,
  answers: [{
    question: ObjectId,
    selectedOption: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Conversations**
```javascript
{
  participants: [ObjectId] (ref: User),
  lastMessage: ObjectId (ref: Message),
  unreadCount: Map<String, Number>,
  createdAt: Date,
  updatedAt: Date
}
```

**Messages**
```javascript
{
  sender: ObjectId (ref: User),
  content: String,
  conversationId: String,
  readBy: [ObjectId],
  createdAt: Date
}
```

**Posts** (Discussion Forum)
```javascript
{
  title: String,
  content: String (HTML),
  author: ObjectId (ref: User),
  topic_id: ObjectId (ref: Topic),
  class_id: ObjectId (ref: Class),
  views: Number,
  isPinned: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 📖 Usage Guide

### For Students

1. **Login** at `/login` with student credentials
2. **Dashboard** (`/home`) shows enrolled classes for current semester
3. **View Classes**: Sidebar navigation with collapsible menu
4. **Assignments**: 
   - Navigate to class → Assignments tab
   - View deadlines and requirements
   - Submit via drag-and-drop interface
   - Check grades and teacher feedback
5. **Online Tests**: 
   - Take tests during scheduled periods
   - Real-time timer with auto-save
   - Multiple attempts allowed (if configured)
   - Immediate results after submission
6. **Course Materials**: Download from Google Drive links
7. **Search Documents**: 
   - Use AI-powered search with natural language
   - Filter by tags and difficulty level
   - Get semantically similar documents
8. **Communication**:
   - **Chat**: Click support widget for admin/teacher chat
   - **VoIP**: Direct voice call to teacher (SIP.js)
   - **Video**: Join when teacher starts conference
   - **Forum**: Post questions, reply to discussions
9. **Recordings**: Access past meeting recordings with AI summaries

### For Teachers

1. **Login** to teacher portal at `/teacher`
2. **Dashboard**: Overview of all assigned classes
3. **Class Management**:
   - View student list with attendance
   - Create and manage assignments
   - Design online tests with question banks
   - Upload materials to Google Drive
   - Post announcements
4. **Content Creation**:
   - **Assignments**: Set deadlines, attach files, configure grading
   - **Tests**: 
     - Add questions manually or import from .docx
     - Schedule activation times
     - Set time limits and attempts
   - **Materials**: Organize by topic with AI tagging
5. **Grading**:
   - Review student submissions
   - Provide numeric scores and text feedback
   - Track late submissions
6. **Video Conferencing**:
   - Start LiveKit session from class page
   - Control whiteboard visibility
   - Mute all participants
   - Share screen for presentations
   - End session with automatic cleanup
7. **Meeting Intelligence**:
   - Recordings auto-transcribed by Gemini AI
   - Review AI-generated summaries
   - Export meeting notes (Markdown)
8. **Communication**: Respond to student chats and calls

### For Admins

1. **Admin Panel** at `/admin`
2. **User Management**:
   - Create students, teachers, admins
   - Bulk import from CSV
   - Edit profiles and passwords
   - Deactivate accounts
3. **Academic Setup**:
   - Create semesters (HK1/HK2-YYYY/YYYY)
   - Define courses with credits
   - Create classes with teacher assignments
   - Configure schedules (day/shift)
4. **Enrollment**:
   - Bulk enroll students from Excel
   - Individual enrollment management
   - Transfer students between classes
5. **Document Library**:
   - Upload documents with metadata
   - AI generates embeddings automatically
   - Organize by tags and levels
   - Monitor search analytics
6. **System Monitoring**:
   - View platform statistics
   - Track user activity logs
   - Monitor server health
7. **Chat Support**: Handle student/teacher inquiries

## 🔒 Security Features

- **Password Security**: bcrypt hashing with 10 salt rounds
- **JWT Authentication**: HS256 algorithm with 7-day expiration
- **Route Protection**: Middleware-enforced role-based access
- **CORS**: Whitelist-based origin validation
- **Input Validation**: express-validator for all endpoints
- **File Restrictions**: Type and size limits (10MB default)
- **XSS Protection**: Content sanitization with DOMPurify
- **SQL Injection Prevention**: Mongoose parameterized queries
- **Socket Authentication**: JWT verification on connection
- **Rate Limiting**: Prevents brute force attacks
- **Secure Headers**: Helmet.js middleware
- **Environment Variables**: Sensitive data in .env files

## 🚀 Deployment

### Production Environment Variables

```env
# Update for production
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/voip-elearning

# Update allowed origins
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
```

### Docker Deployment

1. **Backend Dockerfile** (already configured):
```dockerfile
FROM node:20-alpine
WORKDIR /app/backend
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

2. **Frontend Build**:
```bash
cd frontend
npm run build
# Deploy dist/ folder to static hosting
```

3. **Docker Compose** (optional):
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
  
  mongodb:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] MongoDB Atlas for cloud database
- [ ] Update CORS allowed origins
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure CDN for static assets
- [ ] Set up error logging (Sentry/LogRocket)
- [ ] Enable database backups
- [ ] Monitor cron jobs
- [ ] Load test critical endpoints
- [ ] Configure reverse proxy (Nginx)

## 🐛 Troubleshooting

### VoIP Call Issues

**Symptom**: Calls fail to connect
- Check browser microphone permissions
- Verify TURN server credentials
- Test STUN/TURN with [WebRTC Troubleshooter](https://test.webrtc.org/)
- Ensure firewall allows UDP ports 3478, 5349

**Symptom**: No audio during call
- Inspect browser console for media errors
- Check `<audio>` element has `autoplay` attribute
- Verify SIP.js session tracks are attached
- Test with different browser

### Video Conference Issues

**Symptom**: Black screen in conference
- Grant camera/microphone permissions
- Verify LiveKit URL format (wss://)
- Check API key/secret in `.env`
- Review LiveKit Cloud dashboard for errors

**Symptom**: Whiteboard not loading
- Ensure Tldraw CDN is accessible
- Check browser console for CORS errors
- Verify React version compatibility

### AI Search Not Working

**Symptom**: No search results
- Verify `GEMINI_API_KEY` is valid
- Check document has `embedding` field
- Review similarity threshold (default 0.3)
- Ensure MongoDB indexes are created

**Symptom**: Slow embedding generation
- Gemini API rate limits may apply
- Consider caching embeddings
- Use batch processing for bulk uploads

### Database Connection Errors

```bash
# Check MongoDB status
sudo systemctl status mongod

# View logs
tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

### Socket.IO Disconnections

- Verify JWT token hasn't expired
- Check CORS configuration includes Socket.IO handshake
- Ensure WebSocket upgrades are allowed
- Review network stability

### File Upload Failures

**Google Drive**:
- Check service account has `Editor` role on folder
- Verify folder ID matches `PARENT_FOLDER_ID`
- Review quota limits in Google Cloud Console

**Cloudinary**:
- Confirm API credentials are correct
- Check upload preset allows unsigned uploads
- Review file size limits

## 📊 Performance Optimization

- **Pagination**: 10 items per page default
- **Image Optimization**: Cloudinary automatic transformations
- **Database Indexes**: On email, title, tags, dates
- **Code Splitting**: React.lazy() for route components
- **API Caching**: Redis for frequently accessed data (optional)
- **Socket.IO Rooms**: Efficient event targeting
- **File Streaming**: Multer chunked uploads
- **Lazy Loading**: Images load on scroll
- **Vector Search**: In-memory cache for embeddings
- **Compression**: gzip middleware enabled

## 🌐 Browser Support

- ✅ Chrome 90+ (recommended for WebRTC)
- ✅ Firefox 88+
- ✅ Safari 14+ (limited WebRTC support)
- ✅ Edge 90+
- ❌ IE 11 (not supported)

## 📄 License

MIT License - See [LICENSE](LICENSE) file

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

### Code Style Guidelines

- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive commit messages
- Add JSDoc comments for functions
- Update README for new features
- Write tests for critical paths

## 🎓 Educational Context

**Built for**: Ton Duc Thang University  
**Purpose**: Modernize distance education with:
- Real-time communication infrastructure
- AI-powered learning assistance
- Automated assessment workflows
- Comprehensive analytics

## 👥 Team & Support

- **University**: Ton Duc Thang University
- **Email**: support@voipelearning.shop
- **Documentation**: This README + inline code comments
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] AI grading for subjective answers
- [ ] Plagiarism detection for submissions
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] SSO integration (LDAP/SAML)
- [ ] Calendar integration (Google/Outlook)
- [ ] Push notifications (FCM)
- [ ] Dark mode UI
- [ ] Export reports (PDF/Excel)
- [ ] Gamification (badges, points)
- [ ] Parent portal
- [ ] Integration with Moodle/Canvas
- [ ] Voice commands (speech-to-text)
- [ ] Automated meeting scheduling

---

**🎯 Built with ❤️ for modern education**

© 2025 VoIP E-Learning System | Ton Duc Thang University
