# VoIP E-Learning System

A modern, enterprise-grade Learning Management System (LMS) with integrated VoIP communication, real-time video conferencing, AI-powered features, and comprehensive educational tools built for Ton Duc Thang University.

![E-Learning System](https://res.cloudinary.com/dsj6sba9f/image/upload/v1745247841/c085ad076c442c8191e6b7f48ef59aad_k7izor.jpg)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration-details)
- [API Documentation](#api-documentation)
- [Socket.IO Events](#socketio-events)
- [Database Schema](#database-schema)
- [Usage Guide](#usage-guide)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Security Features](#security-features)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

VoIP E-Learning is a comprehensive, production-ready educational platform that combines traditional LMS features with cutting-edge real-time communication and AI capabilities. The system is designed for scalability, reliability, and seamless user experience across web and mobile platforms.

### Key Highlights

- **🎥 Video Conferencing**: LiveKit-powered virtual classrooms with screen sharing, interactive whiteboard (Tldraw 4.2.0), and session recording with automatic transcription and AI summarization
- **📞 VoIP Communication**: WebRTC-based SIP.js calling with TURN/STUN servers for NAT traversal
- **🤖 AI-Powered Features**: 
  - Vector similarity search using Google Gemini AI embeddings (1536 dimensions)
  - Automatic meeting transcription and summarization (Gemini 2.0 Flash)
  - Intelligent document retrieval with semantic search
  - AI-generated meeting titles and markdown-formatted notes
- **📝 Online Testing**: Advanced testing system with auto-grading, scheduled activation/deactivation (cron jobs), forced submission on timeout, and multiple attempt tracking
- **📚 Assignment Management**: Full lifecycle from creation to submission and grading with Google Drive integration
- **💬 Real-time Communication**: Socket.IO powered chat, discussion forums with nested comments, and live notifications
- **📊 Comprehensive Analytics**: Student progress tracking, attendance monitoring, and class performance insights
- **⚡ Background Processing**: BullMQ job queue with Redis for asynchronous AI processing and email notifications
- **🔐 Enterprise Security**: JWT authentication, bcrypt password hashing, role-based access control (RBAC), and input validation

## ✨ Key Features

### 🎓 Educational Features

#### Class & Course Management
- **Semester-based Organization**: Academic year structure (HK1-2024/2025, HK2-2024/2025, HK3-2024/2025)
- **Multi-class Enrollment**: Students can enroll in unlimited classes per semester
- **Course Materials Library**: Google Drive API integration with automatic permission management
- **Teaching Schedule Management**: Support for theory and practice sessions with configurable day/shift scheduling
- **Attendance Tracking**: Digital check-in system with session-based attendance and automated reporting
- **Schedule Notifications**: Automatic email reminders for upcoming classes
- **Real-time Updates**: Class roster changes synchronized instantly via Socket.IO

#### Online Testing System 🎯
- **Flexible Test Creation**: Configure title, description, duration, attempt limits, and shuffle options
- **Question Bank Management**: Support for multiple-choice questions with Word document import (Mammoth.js)
- **Automated Grading**: Instant results calculation with detailed answer feedback
- **Test Session Tracking**: Individual instances per student with attempt history and timing
- **Lifecycle Management**: Automated status transitions (not_started → ongoing → ended)
- **Cron Job Automation**: 
  - Minute-based status updates checking start/end times
  - Forced submission for timed-out sessions
  - Automatic availability toggle on test expiration
- **Multiple Attempts**: Configure max attempts with best score tracking and attempt comparison
- **Anti-cheating**: Question shuffling, time limits, and single-session enforcement

#### Assignment Management 📋
- **Rich Assignment Creation**: Deadlines, descriptions, file attachments, and Google Drive integration
- **Submission Workflow**: File upload with type/size validation, late submission detection
- **Grading System**: Numeric grades (0-100) with detailed text feedback
- **Batch Operations**: Bulk grading and CSV export functionality
- **Status Tracking**: Real-time submission monitoring (submitted, graded, late)
- **File Management**: Google Drive automatic permission setup for student access

#### AI-Powered Document Search 🔍
- **Vector Embeddings**: Documents embedded using Google Generative AI (Gemini embedding-001)
- **Semantic Search**: Meaning-based retrieval, not just keyword matching
- **Multi-field Embeddings**: Separate 1536-dimension vectors for title, description, tags, and level
- **Weighted Similarity**: 40% title + 30% description + 20% tags + 10% level = final relevance score
- **Hybrid Search**: Combines vector similarity with traditional filters (tags, academic level)
- **Scalable Architecture**: Indexed MongoDB fields for fast query performance

### 💬 Communication Features

#### VoIP Calling (SIP.js + WebRTC) 📞
- **Direct Calling**: Student-to-teacher voice calls via SIP over WebSocket
- **Session Management**: Incoming, outgoing, active call state tracking
- **Call States**: idle → calling → in-call → terminated
- **Audio Streaming**: Remote audio playback through HTML5 MediaStream API
- **ICE Configuration**: STUN/TURN servers for NAT traversal
  ```
  STUN: stun.l.google.com:19302
  TURN: webrtc.voipelearning.shop:3478 (UDP/TCP)
  TURNS: webrtc.voipelearning.shop:5349 (TLS)
  ```
- **Asterisk Integration**: Backend sync service for SIP user management

#### Video Conferencing (LiveKit 2.14.0) 🎥
- **Virtual Classrooms**: Teacher-initiated live sessions with unique room tokens
- **Screen Sharing**: Built-in presentation mode with high-quality streaming
- **Interactive Whiteboard**: Tldraw 4.2.0 collaborative drawing with real-time synchronization
- **Teacher Controls**: Mute all, toggle whiteboard, end session, kick participants
- **Participant Management**: Automatic cleanup on disconnect, connection quality indicators
- **Recording System**: 
  - **LiveKit Egress**: Automated MP4 recording to AWS S3
  - **Background Processing**: BullMQ job queue for AI transcription
  - **Meeting Intelligence**: Gemini 2.0 Flash generates transcripts, summaries, and titles
  - **Email Notifications**: Teachers notified when AI processing completes
  - **Review & Publish**: Teachers can edit AI summaries before publishing to students
- **Auto-reconnect**: Token refresh on expiration with seamless reconnection

#### Real-time Chat (Socket.IO 4.8.1) 💭
- **Personal Messaging**: Direct chat with admin and teachers
- **Conversation Persistence**: MongoDB-backed chat history with full search
- **Socket.IO Authentication**: JWT-based secure connections on `/chat` namespace
- **Read Receipts**: Message read status with "seen" timestamps
- **Unread Counter**: Real-time badge updates for new messages
- **Delivery Confirmation**: Optimistic UI with server-side validation
- **Typing Indicators**: Live "typing..." status broadcasting

#### Discussion Forums 🗣️
- **Topic-based Organization**: Categorized discussion areas per class
- **Rich Post Creation**: React Quill editor for formatted content
- **Nested Comments**: Multi-level threaded discussions
- **Real-time Updates**: Socket.IO namespace for instant comment notifications
- **Post Analytics**: View counts, comment counts, engagement metrics
- **Voting System**: Upvote/downvote for community-driven content ranking
- **Moderation Tools**: Teacher/admin capabilities for content management

### 👥 User Roles & Permissions

#### Admin 🔐
- **User Management**: CRUD operations for students, teachers, admins with bulk CSV import
- **Academic Structure**: Create/manage semesters, courses, and class schedules
- **Enrollment Control**: Individual and bulk class enrollment with validation
- **Document Library**: Upload documents with AI embedding generation for semantic search
- **System Analytics**: Dashboard with user statistics, class enrollment trends, system health
- **Chat Support**: Interface for responding to all user inquiries
- **Topic Management**: Create discussion categories and moderate forums
- **Data Export**: CSV/Excel reports for grades, attendance, enrollment

#### Teacher 📚
- **Class Dashboard**: Overview of assigned classes with student roster and statistics
- **Assignment Creation**: Google Drive integration for resource sharing
- **Test Design**: Online test builder with question bank and auto-grading
- **Material Management**: Upload documents, videos, links to shared Drive folders
- **Grading Interface**: Grade submissions with feedback and batch operations
- **Attendance System**: Mark attendance per session with export capabilities
- **Announcements**: Broadcast notifications to class with email integration
- **Video Hosting**: Start/stop LiveKit conferences with recording capabilities
- **Recording Management**: Review AI-generated summaries, edit, and publish to students
- **Student Communication**: Direct chat support and discussion forum participation
- **Analytics**: Student performance tracking, assignment completion rates, test statistics
- **Schedule Management**: Create teaching schedules with automatic email reminders

#### Student 🎓
- **Class Overview**: View enrolled classes with upcoming assignments and tests
- **Assignment Submission**: File upload with deadline tracking and late status indicators
- **Online Testing**: Take scheduled tests with timer, progress tracking, and instant results
- **Material Access**: Download course resources from Google Drive
- **Discussion Participation**: Create posts, comment, vote in class forums
- **Video Attendance**: Join live conferences with whiteboard collaboration
- **VoIP Access**: Call assigned teachers via WebRTC
- **Real-time Chat**: Message admin/teachers for support
- **Grade Portal**: View grades, feedback, and score analytics
- **Recording Library**: Access published meeting recordings with AI transcripts and summaries
- **Document Search**: AI-powered semantic search across all course materials
- **Attendance History**: View personal attendance records and session details

## 🛠 Technology Stack

### Frontend

**Core Framework**
- React 18.3.1 with React DOM 18.3.1
- Vite 7.1.2 (ultra-fast HMR and build tool)
- React Router DOM 7.8.0 (routing and navigation)

**UI & Styling**
- TailwindCSS 3.4.17 (utility-first CSS framework)
- Motion 12.23.22 (Framer Motion - advanced animations)
- Headless UI 2.2.9 (accessible unstyled components)
- React Icons 5.5.0 + Lucide React 0.552.0 (icon libraries)
- @tailwindcss/line-clamp 0.4.4 (text truncation)

**Communication & Real-time**
- Socket.IO Client 4.8.1 (WebSocket for chat & discussions)
- SIP.js 0.21.2 (VoIP calling via WebRTC)
- @livekit/components-react 2.9.15 (video conferencing UI)
- @livekit/components-styles 1.1.6 (LiveKit default styles)
- livekit-client 2.15.14 (LiveKit SDK)

**Forms & Validation**
- React Hook Form 7.64.0 (performant form library)
- Joi validation (backend schema validation)

**Media & Files**
- Cloudinary integration (image/video CDN)
- React Quill 2.0.3 (WYSIWYG rich text editor)
- Quill 2.0.3 (core editor library)
- Axios 1.11.0 (HTTP client with interceptors)
- axios-retry 4.5.0 (automatic request retry)

**Data Visualization**
- Chart.js 4.5.0 (canvas-based charts)
- react-chartjs-2 5.3.0 (React wrapper)
- chartjs-plugin-datalabels 2.2.0 (chart annotations)
- @fullcalendar/react 6.1.19 (calendar component)
- @fullcalendar/daygrid 6.1.19 (month view)
- @fullcalendar/timegrid 6.1.19 (week/day view)
- @fullcalendar/interaction 6.1.19 (drag & drop)

**Utilities**
- React Toastify 11.0.5 (toast notifications)
- @tippyjs/react 4.2.6 (tooltips & popovers)
- date-fns 4.1.0 (date manipulation)
- PapaParse 5.5.3 (CSV parsing)
- uuid 13.0.0 (unique ID generation)
- zustand 5.0.8 (lightweight state management)

**Whiteboard & Collaboration**
- tldraw 4.2.0 (collaborative infinite canvas)

**Build & Development**
- @vitejs/plugin-react-swc 4.0.0 (SWC for faster builds)
- ESLint 9.33.0 (code linting)
- PostCSS 8.5.6 + Autoprefixer 10.4.21 (CSS processing)

### Backend

**Runtime & Framework**
- Node.js 20.x LTS
- Express 5.1.0 (web framework)
- body-parser 2.2.1 (request parsing)
- compression 1.8.1 (gzip compression)

**Database**
- MongoDB 6.x (NoSQL database)
- Mongoose 8.18.2 (ODM with schema validation)

**Authentication & Security**
- jsonwebtoken 9.0.2 (JWT creation/verification)
- bcryptjs 3.0.2 (password hashing)
- Joi 18.0.1 (input validation)
- CORS 2.8.5 (cross-origin resource sharing)
- cookie-session 2.1.1 (session management)
- passport 0.7.0 (authentication middleware)
- passport-google-oauth20 2.0.0 (Google OAuth)

**Real-time Communication**
- Socket.IO 4.8.1 (WebSocket server)
- livekit-server-sdk 2.14.0 (LiveKit room & token management)
- ari-client 2.2.0 (Asterisk REST Interface)

**AI & Machine Learning**
- @google/generative-ai 0.24.1 (Gemini AI for embeddings & summarization)
- @huggingface/inference 4.13.4 (HuggingFace transformers)
- Custom vector similarity calculations (cosine similarity)

**File Storage & Processing**
- Multer 2.0.2 (multipart/form-data handling)
- googleapis 162.0.0 (Google Drive API v3)
- google-auth-library 10.4.0 (OAuth2 client)
- Cloudinary 2.7.0 (image/video CDN)
- Mammoth 1.11.0 (Word .docx to HTML/text)
- fs-extra 11.3.2 (enhanced file system operations)
- adm-zip 0.5.16 (ZIP file handling)

**Cloud Storage (AWS S3)**
- @aws-sdk/client-s3 3.226.0 (S3 operations)
- @aws-sdk/s3-request-presigner 3.940.0 (signed URLs)

**Background Jobs & Queue**
- BullMQ 5.65.1 (Redis-based job queue)
- Redis 7-alpine (in-memory data store)
- node-cron 4.2.1 (scheduled tasks)

**Email**
- Nodemailer 7.0.12 (SMTP email sending)
- HTML email templates (custom implementation)

**Utilities**
- axios 1.13.2 (HTTP client)
- colors 1.4.0 (terminal colors)
- uuid 13.0.0 (unique IDs)
- node-fetch 3.3.2 (fetch API)
- dotenv 17.2.3 (environment variables)
- mysql2 3.15.3 (MySQL connector for Asterisk)

**Testing**
- Jest 29.7.0 (unit testing framework)
- Vitest 4.0.15 (Vite-native testing)
- @vitest/ui 4.0.15 (test UI dashboard)
- Supertest 6.3.3 (HTTP assertions)
- mongodb-memory-server 9.1.3 (in-memory MongoDB for tests)

**Development**
- Nodemon 3.1.10 (auto-restart on file changes)
- cross-env 7.0.3 (cross-platform env vars)

### Infrastructure & DevOps

**Containerization**
- Docker (backend, frontend, worker services)
- Docker Compose 3.8 (multi-container orchestration)
- Redis 7-alpine (queue backend)

**Deployment**
- Render.com (cloud hosting)
- PM2 Ecosystem (process management)
- NGINX (reverse proxy, static file serving)

**External Services**
- LiveKit Cloud (video conferencing infrastructure)
- Cloudinary (media CDN)
- AWS S3 (recording storage)
- Google Cloud Platform (Drive API, Gemini AI)
- Asterisk PBX (SIP server)
- TURN/STUN servers (WebRTC connectivity)

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React UI   │  │  Socket.IO   │  │   SIP.js     │          │
│  │  (Vite SPA)  │  │   Client     │  │  (WebRTC)    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │ HTTPS/REST       │ WebSocket        │ WSS/RTP
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Express.js Server (Port 5000)                    │  │
│  │  CORS │ Compression │ JWT Auth │ Body Parser │ Logger    │  │
│  └───────┬──────────────────────────────────────────────────┘  │
└──────────┼──────────────────────────────────────────────────────┘
           │
           ├─────► Socket.IO Namespaces (/chat, /discussion)
           │
┌──────────┼──────────────────────────────────────────────────────┐
│          ▼           Service Layer                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │   Auth     │  │  Class &   │  │  Testing   │  │  Chat &  │ │
│  │  Service   │  │  Course    │  │  Service   │  │  Social  │ │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘ │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │  Drive &   │  │  Recording │  │   Email    │  │  Embed   │ │
│  │  Material  │  │  Service   │  │  Service   │  │  Service │ │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘ │
└───────────┬──────────────────────────────────────────────────────┘
            │
            ├──────────┐
            ▼          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Background Jobs Layer                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Redis (BullMQ)                         │  │
│  │  ┌────────────────────────────────────────────────┐      │  │
│  │  │  transcribeAndSummarize Queue                  │      │  │
│  │  └─────────────────┬──────────────────────────────┘      │  │
│  └────────────────────┼───────────────────────────────────────┘ │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              AI Worker Service (Separate Container)       │  │
│  │  • Download MP4 from S3                                   │  │
│  │  • Gemini 2.5 Flash Transcription                         │  │
│  │  • AI Summary & Title Generation                          │  │
│  │  • Update Database                                        │  │
│  │  • Send Email Notification                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Data Persistence Layer                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │  MongoDB   │  │   Redis    │  │  MySQL     │               │
│  │  (Primary  │  │  (Cache &  │  │ (Asterisk  │               │
│  │  Database) │  │   Queue)   │  │   Users)   │               │
│  └────────────┘  └────────────┘  └────────────┘               │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ LiveKit  │  │  AWS S3  │  │ Google   │  │Cloudinary│       │
│  │  Cloud   │  │Recording │  │ Drive &  │  │  (CDN)   │       │
│  │  (Video) │  │ Storage  │  │ Gemini   │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│  ┌──────────┐  ┌──────────┐                                    │
│  │Asterisk  │  │   TURN   │                                    │
│  │   PBX    │  │  /STUN   │                                    │
│  │  (SIP)   │  │  Servers │                                    │
│  └──────────┘  └──────────┘                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Examples

#### 1. Video Conference Recording → AI Processing

```
Teacher stops recording
    ↓
LiveKit Egress → S3 Upload (MP4)
    ↓
Webhook triggers API endpoint
    ↓
API adds job to BullMQ (transcribeAndSummarize)
    ↓
AI Worker Service picks up job
    ↓
Download MP4 → Gemini 2.0 Flash (transcribe & summarize)
    ↓
Update MongoDB (recordLessonSummary)
    ↓
Send email to teacher (Nodemailer)
```

#### 2. Document Search with AI Embeddings

```
User enters search query
    ↓
Frontend → POST /api/document/search
    ↓
Backend generates embedding (Gemini)
    ↓
MongoDB vector similarity calculation
    ↓
Weighted scoring (title:40%, desc:30%, tags:20%, level:10%)
    ↓
Filter by threshold (>0.3)
    ↓
Return ranked results to frontend
```

#### 3. Online Test Lifecycle

```
Cron job runs every minute
    ↓
Check current time vs test.start/end
    ↓
Update test.available status
    ↓
Students see test availability change (real-time via Socket.IO)
    ↓
Student takes test → TestSession created
    ↓
Timer expires → Cron force submits (submitTestSession)
    ↓
Auto-grade → TestAttempt with score
```

## 📁 Project Structure

```
VoIP E-Learning/
├── docker-compose.yml                # Multi-container orchestration
├── render.yaml                        # Render.com deployment config
├── README.md                          # This file
│
├── frontend/                          # React SPA
│   ├── Dockerfile                     # Frontend container
│   ├── vite.config.js                 # Vite build configuration
│   ├── tailwind.config.js             # TailwindCSS customization
│   ├── eslint.config.js               # Code quality rules
│   ├── package.json                   # Frontend dependencies
│   │
│   ├── public/
│   │   ├── sample-users.csv           # CSV import template
│   │   └── sounds/                    # Notification sounds
│   │
│   └── src/
│       ├── main.jsx                   # React entry point
│       ├── App.jsx                    # Root component with routing
│       ├── index.css                  # Global styles & Tailwind
│       │
│       ├── assets/                    # Static resources (images, icons)
│       │
│       ├── components/
│       │   ├── Chat/                  # Chat UI components
│       │   │   ├── ChatWithAdmin.jsx
│       │   │   └── ChatWithTeacher.jsx
│       │   ├── Common/                # Shared components
│       │   │   ├── NavBar.jsx
│       │   │   ├── SupportedWidget.jsx
│       │   │   └── DropdownButton.jsx
│       │   ├── Modals/                # Dialog components
│       │   │   ├── AddQuestionModal.jsx
│       │   │   ├── TestModal.jsx
│       │   │   ├── AddStudentModal.jsx
│       │   │   └── AssignmentModal.jsx
│       │   ├── UI/                    # Reusable UI elements
│       │   │   ├── Button.jsx
│       │   │   ├── Pagination.jsx
│       │   │   ├── ConfirmDialog.jsx
│       │   │   ├── TextInput.jsx
│       │   │   └── LoaderOverlay.jsx
│       │   └── Voip/                  # VoIP & Video components
│       │       ├── ConferenceRoom.jsx
│       │       ├── MessageCall.jsx
│       │       ├── WhiteboardTldraw.jsx
│       │       └── TeacherControls.jsx
│       │
│       ├── context/                   # React Context API
│       │   └── LoadingContext.jsx
│       │
│       ├── hooks/                     # Custom React hooks
│       │   └── useAuth.js
│       │
│       ├── layout/                    # Layout wrappers
│       │   ├── HomeworkLayout.jsx
│       │   ├── AdminLayout.jsx
│       │   └── TeacherLayout.jsx
│       │
│       ├── pages/                     # Route components
│       │   ├── Admin/
│       │   │   ├── ManageClassDetails.jsx
│       │   │   ├── ManageUsers.jsx
│       │   │   ├── Dashboard.jsx
│       │   │   └── DocumentLibrary.jsx
│       │   ├── Teacher/
│       │   │   ├── ClassDetails.jsx
│       │   │   ├── GradeSubmissions.jsx
│       │   │   ├── Recordings.jsx
│       │   │   └── ManageSchedule.jsx
│       │   ├── Student/
│       │   │   ├── ClassDetails.jsx
│       │   │   ├── TakeTest.jsx
│       │   │   └── SearchDocuments.jsx
│       │   ├── VoIP/
│       │   │   └── VideoConference.jsx
│       │   ├── Login.jsx
│       │   └── LMS404Page.jsx
│       │
│       ├── routers/                   # React Router configuration
│       │   └── AppRouter.jsx
│       │
│       ├── services/                  # API service layer
│       │   ├── authService.js
│       │   ├── chatService.js
│       │   ├── classService.js
│       │   ├── enrollmentService.js
│       │   ├── roomService.js
│       │   ├── sipClientService.js
│       │   ├── documentService.js
│       │   └── http.js                # Axios instance with interceptors
│       │
│       └── utils/                     # Helper functions
│           └── formatTime.js
│
└── backend/                           # Express.js API
    ├── Dockerfile                     # Backend container
    ├── ecosystem.config.js            # PM2 process management
    ├── jest.config.js                 # Jest testing configuration
    ├── vitest.config.js               # Vitest configuration
    ├── package.json                   # Backend dependencies
    │
    ├── tests/                         # Test suites
    │   ├── setup.vitest.js
    │   ├── unit/
    │   │   ├── services/              # Service layer tests (Vitest)
    │   │   │   ├── commentService.test.js
    │   │   │   ├── userService.test.js
    │   │   │   ├── aiService.test.js
    │   │   │   ├── EmbeddingService.test.js
    │   │   │   └── [25+ service tests]
    │   │   └── utils/                 # Utility function tests
    │   │       ├── VectorSimilarity.test.js
    │   │       └── token.test.js
    │   └── integrations/              # Integration tests (Jest)
    │       └── routers/               # API endpoint tests
    │
    └── src/
        ├── server.js                  # Express app entry point
        │
        ├── config/
        │   ├── db.js                  # MongoDB connection
        │   ├── credentials.json       # Google service account
        │   ├── googleConfig.js        # OAuth2 client setup
        │   └── cloudinary.js          # Cloudinary configuration
        │
        ├── controller/                # Request handlers (28 controllers)
        │   ├── authController.js
        │   ├── chatController.js
        │   ├── classController.js
        │   ├── onlineTestController.js
        │   ├── voipController.js
        │   ├── recordingController.js
        │   ├── livekitController.js
        │   ├── recommendController.js
        │   └── [20+ more controllers]
        │
        ├── cron/                      # Scheduled jobs
        │   ├── updateOnlineTest.js    # Test status automation (every minute)
        │   └── submitTestSession.js   # Force submit on timeout
        │
        ├── middlewares/
        │   ├── authMiddleware.js      # JWT verification
        │   ├── authorizeRole.js       # RBAC enforcement
        │   ├── errorHandler.js        # Global error handler
        │   ├── logger.js              # Request logging
        │   ├── upload.js              # Multer file upload
        │   ├── validate.js            # Joi validation middleware
        │   └── asyncHandler.js        # Async error wrapper
        │
        ├── model/                     # Mongoose schemas (23 models)
        │   ├── user.js
        │   ├── class.js
        │   ├── class_student.js
        │   ├── assignment.js
        │   ├── online_test.js
        │   ├── testQuestion.js
        │   ├── testSession.js
        │   ├── testAttempt.js
        │   ├── submission.js
        │   ├── conversation.js
        │   ├── message.js
        │   ├── document.js            # AI-searchable documents
        │   ├── post.js
        │   ├── comment.js
        │   ├── recordLessonSummary.js # Recording metadata
        │   └── [8+ more models]
        │
        ├── router/                    # Express routes
        │   ├── authRouter.js
        │   ├── chatRouter.js
        │   ├── classRouter.js
        │   ├── voipRouter.js
        │   ├── livekitRouter.js
        │   ├── recordingRouter.js
        │   ├── testOnlineRouter.js
        │   ├── webHookRouter.js       # LiveKit webhook handler
        │   └── [20+ more routers]
        │
        ├── service/                   # Business logic layer (28 services)
        │   ├── authService.js
        │   ├── chatService.js
        │   ├── classService.js
        │   ├── driveService.js        # Google Drive API
        │   ├── aiService.js           # Gemini AI integration
        │   ├── aiWorkerService.js     # BullMQ worker (separate process)
        │   ├── jobQueueService.js     # BullMQ queue setup
        │   ├── EmbeddingService.js    # Vector embedding abstraction
        │   ├── recordingService.js    # LiveKit Egress control
        │   ├── emailService.js        # Nodemailer SMTP
        │   ├── teachingScheduleService.js
        │   ├── asteriskSyncService.js # SIP user sync
        │   └── [16+ more services]
        │
        ├── sockets/                   # Socket.IO namespaces
        │   ├── chatSocket.js          # /chat namespace
        │   └── discussionSocket.js    # /discussion namespace
        │
        ├── utils/                     # Helper utilities
        │   ├── VectorSimilarity.js    # Cosine similarity
        │   ├── token.js               # JWT helpers
        │   ├── emailTemplete.js       # HTML email templates
        │   └── formatVietnameseDate.js
        │
        └── validation/                # Joi schemas
            ├── authValidation.js
            ├── classValidation.js
            └── [validation schemas]
```
    │   │       ├── courseService.test.js
    │   │       ├── commentService.test.js
    │   │       ├── assignmentService.test.js
    │   │       ├── driveService.test.js
    │   │       ├── submissionService.test.js
    │   │       ├── materialService.test.js
    │   │       ├── classService.test.js
    │   │       ├── attendanceService.test.js
    │   │       ├── announcementService.test.js
    │   │       ├── postService.test.js
    │   │       ├── semesterService.test.js
    │   │       ├── topicService.test.js
    │   │       ├── documentService.test.js
    │   │       ├── classStudentService.test.js
    │   │       ├── testQuestionService.test.js
    │   │       ├── roomService.test.js
    │   │       ├── onlineTestService.test.js
    │   │       ├── chatService.test.js
    │   │       ├── EmbeddingService.test.js
    │   │       ├── aiService.test.js
    │   │       ├── emailService.test.js
    │   │       ├── scheduleService.test.js
    │   │       ├── teachingScheduleService.test.js
    │   │       └── jobQueueService.test.js
    │   ├── sockets/
    │   │   ├── chatSocket.js          # Chat namespace
    │   │   └── discussionSocket.js    # Discussion events
    │   ├── utils/
    │   │   ├── VectorSimilarity.js    # Cosine similarity calculations
    │   │   ├── token.js               # JWT utilities
    │   │   ├── emailTemplete.js       # Email template generation
    │   │   └── __tests__/             # Utils unit tests
    │   │       ├── VectorSimilarity.test.js
    │   │       ├── token.test.js
    │   │       └── emailTemplete.test.js
    │   └── server.js                  # Express server
    ├── Dockerfile
    └── package.json
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js**: v20.x or higher ([Download](https://nodejs.org/))
- **MongoDB**: v6.x or higher ([Download](https://www.mongodb.com/try/download/community))
- **Redis**: v7.x or higher (for BullMQ job queue)
- **Docker** (optional): For containerized deployment
- **Google Cloud Project**: For Drive API and Gemini AI ([Console](https://console.cloud.google.com))
- **Cloudinary Account**: For image/video CDN ([Sign up](https://cloudinary.com/))
- **LiveKit Account**: For video conferencing ([Cloud](https://cloud.livekit.io/))
- **AWS Account**: For S3 recording storage (optional)
- **SIP Server**: Asterisk PBX for VoIP (optional)

### Quick Start with Docker Compose

```bash
# Clone repository
git clone https://github.com/your-org/voip-e-learning.git
cd voip-e-learning

# Create backend .env file (see Configuration section)
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Start all services
docker compose up -d --build

# Services will be available at:
# Frontend: http://localhost:80
# Backend API: http://localhost:5000
# Redis: localhost:6379
```

### Manual Backend Setup

1. **Clone and navigate**

```bash
git clone https://github.com/your-org/voip-e-learning.git
cd voip-e-learning/backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Configuration**

Create `.env` file in `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/voip-elearning

# Redis (for BullMQ)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Cloudinary (Image/Video CDN)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# LiveKit Video Conferencing
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
LIVEKIT_URL=wss://your-project.livekit.cloud

# AWS S3 (for recording storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name

# Google AI (Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Google OAuth & Drive API
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (SMTP - Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# MySQL (for Asterisk SIP users - optional)
MYSQL_HOST=localhost
MYSQL_USER=asterisk
MYSQL_PASSWORD=asterisk-password
MYSQL_DATABASE=asterisk
```

4. **Google Services Setup**

**a) Google Drive API:**
- Visit [Google Cloud Console](https://console.cloud.google.com)
- Create a new project or select existing
- Enable "Google Drive API" in API Library
- Create Service Account (IAM & Admin → Service Accounts)
- Generate JSON key for service account
- Download and save as `backend/src/config/credentials.json`
- Share your Google Drive folder with service account email (`xxx@xxx.iam.gserviceaccount.com`)
- Copy folder ID from Drive URL and set in code (`driveService.js`)

**b) Gemini AI:**
- Visit [Google AI Studio](https://aistudio.google.com/apikey)
- Create API key
- Add to `.env` as `GEMINI_API_KEY`

5. **Start Services**

```bash
# Start MongoDB
mongod --dbpath /path/to/data/db

# Start Redis
redis-server

# Start backend API server
npm run dev    # Development with nodemon
npm start      # Production

# Start AI Worker (in separate terminal)
node src/service/aiWorkerService.js
```

Server runs on: `http://localhost:5000`

### Manual Frontend Setup

1. **Navigate to frontend**

```bash
cd ../frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Configuration**

Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_WEBSOCKET_URL=http://localhost:5000
VITE_DOMAIN=voipelearning.shop
VITE_LIVEKIT_URL=wss://your-project.livekit.cloud
```

4. **Start development server**

```bash
npm run dev       # Development mode
npm run build     # Production build
npm run preview   # Preview production build
```

Application runs on: `http://localhost:5173`

### Database Initialization

The backend will automatically:
- Connect to MongoDB on startup
- Create indexes for optimal query performance
- Run initial admin user creation (check `initAdmin.js`)

**Default Admin Credentials** (if using init script):
- Email: `admin@voipelearning.com`
- Password: `Admin@123` (change immediately!)

### Testing

```bash
# Backend tests
cd backend

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run service tests (Vitest)
npm run test:services

# Run integration tests
npm run test:integration

# Run with coverage
npm test -- --coverage
```

## ⚙️ Configuration Details

### VoIP Configuration (sipClientService.js)

```javascript
const iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  {
    urls: [
      "turn:webrtc.voipelearning.shop:3478?transport=udp",
      "turn:webrtc.voipelearning.shop:3478?transport=tcp",
      "turns:webrtc.voipelearning.shop:5349",
    ],
    username: "any",
    credential: "your-turn-server-credential",
  },
];
```

**Setup Your Own TURN Server** (coturn):
```bash
# Install coturn
sudo apt-get install coturn

# Edit /etc/turnserver.conf
listening-port=3478
tls-listening-port=5349
external-ip=YOUR_PUBLIC_IP
realm=voipelearning.shop
user=any:your-credential

# Start service
sudo systemctl start coturn
```

### AI Configuration

**Gemini Model**: `gemini-2.5                               -flash-exp`
- **Embeddings**: `text-embedding-004` model (1536 dimensions)
- **Transcription**: Audio/video file upload with audio extraction
- **Summarization**: Structured JSON output with title, transcript, summary
- **Rate Limiting**: 60 requests/minute (with automatic retry logic)

**Vector Similarity**:
- **Algorithm**: Cosine similarity
- **Weighted Combination**: 
  - Title: 40%
  - Description: 30%
  - Tags: 20%
  - Level: 10%
- **Threshold**: 0.3 minimum similarity score
- **Normalization**: L2 normalization of embeddings

**Embedding Service Configuration**:
```javascript
// Can switch between HuggingFace and Google Gemini
const embeddingService = new GoogleEmbeddingService(
  process.env.GEMINI_API_KEY,
  "text-embedding-004"
);
```

### CORS Configuration

```javascript
const allowedOrigins = [
  "http://localhost",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://voip-e-learning-1.onrender.com",
  "https://meet.livekit.io",
  "http://localhost:5000",
  "https://lms-api-ajf4.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);
```

### Socket.IO Namespaces

**Chat Namespace** (`/chat`):
```javascript
io.of("/chat")
  .use(authenticateSocket)
  .on("connection", (socket) => {
    // JWT authentication required
    // Events: sendMessage, messageReceived, typing, stopTyping
  });
```

**Discussion Namespace** (default `/`):
```javascript
io.on("connection", (socket) => {
  // Events: newComment, newPost, postUpdate, deleteComment
});
```

### BullMQ Job Queue Configuration

```javascript
const connection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: 6379,
    };

export const transcriptionQueue = new Queue("transcribeAndSummarize", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 60000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
```

**Worker Configuration**:
```javascript
const worker = new Worker(
  "transcribeAndSummarize",
  async (job) => {
    const { roomName, recordingUrl, egressId } = job.data;
    // Process AI transcription and summarization
  },
  {
    connection,
    concurrency: 5, // Process 5 jobs simultaneously
  }
);
```

### Cron Jobs

**Online Test Status Updater** (runs every minute):
```javascript
cron.schedule("* * * * *", async () => {
  // Update tests to unavailable if end time has passed
  await OnlineTest.updateMany(
    { end: { $lt: new Date() }, available: true },
    { $set: { available: false } }
  );
});
```

**Test Session Auto-Submit** (runs every minute):
```javascript
cron.schedule("* * * * *", async () => {
  // Force submit sessions that exceeded time limit
  // Calculate scores and create test attempts
});
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login and receive JWT token | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/verify` | Verify JWT token validity | Yes |
| POST | `/auth/google` | Google OAuth login | No |

### User Management

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/user` | Get all users | Admin |
| GET | `/user/:id` | Get user by ID | Any |
| POST | `/user` | Create user | Admin |
| PUT | `/user/:id` | Update user | Admin/Self |
| DELETE | `/user/:id` | Delete user | Admin |
| GET | `/user/teacher/available` | Get available teachers | Any |

### Semester & Course

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/semester` | Get all semesters | Any |
| POST | `/semester` | Create semester | Admin |
| GET | `/course` | Get all courses | Any |
| POST | `/course` | Create course | Admin |

### Class Management

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/class` | Get all classes | Admin |
| GET | `/class/:id` | Get class details | Enrolled |
| POST | `/class` | Create class | Admin |
| PUT | `/class/:id` | Update class | Admin |
| DELETE | `/class/:id` | Delete class | Admin |
| GET | `/class/teacher/:teacherId` | Get teacher's classes | Teacher |
| GET | `/class/student/:studentId` | Get student's classes | Student |

### Enrollment

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/enrollment/student/:studentId` | Get student enrollments | Student/Admin |
| POST | `/enrollment` | Enroll student in class | Admin |
| DELETE | `/enrollment/:id` | Remove enrollment | Admin |
| POST | `/enrollment/bulk` | Bulk enroll from CSV | Admin |

### Online Tests

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/online-test/class/:classId` | Get tests for class | Enrolled |
| GET | `/online-test/:id` | Get test details | Teacher |
| POST | `/online-test` | Create test | Teacher |
| PUT | `/online-test/:id` | Update test | Teacher |
| DELETE | `/online-test/:id` | Delete test | Teacher |
| GET | `/online-test/:id/available` | Check test availability | Student |

### Test Questions

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/test-question/test/:testId` | Get test questions | Teacher |
| POST | `/test-question` | Add question manually | Teacher |
| PUT | `/test-question/:id` | Update question | Teacher |
| DELETE | `/test-question/:id` | Delete question | Teacher |
| POST | `/upload-question` | Bulk import from .docx | Teacher |

### Test Sessions & Attempts

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/test-session` | Start test session | Student |
| GET | `/test-session/:id` | Get session details | Student |
| GET | `/test-session/test/:testId/student/:studentId` | Get student sessions | Student/Teacher |
| POST | `/attempt` | Submit answers | Student |
| GET | `/attempt/session/:sessionId` | Get attempt details | Student/Teacher |
| GET | `/attempt/test/:testId/results` | Get all test results | Teacher |

### Assignments

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/assignment/class/:classId` | Get class assignments | Enrolled |
| GET | `/assignment/:id` | Get assignment details | Enrolled |
| POST | `/assignment` | Create assignment | Teacher |
| PUT | `/assignment/:id` | Update assignment | Teacher |
| DELETE | `/assignment/:id` | Delete assignment | Teacher |

### Submissions

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/submission` | Submit assignment | Student |
| GET | `/submission/assignment/:assignmentId` | Get all submissions | Teacher |
| GET | `/submission/student/:studentId` | Get student submissions | Student |
| PUT | `/submission/:id/grade` | Grade submission | Teacher |
| DELETE | `/submission/:id` | Delete submission | Student/Teacher |

### Materials

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/material/class/:classId` | Get class materials | Enrolled |
| POST | `/material` | Upload material | Teacher |
| DELETE | `/material/:id` | Delete material | Teacher |
| GET | `/material/:id/download` | Get Drive download link | Enrolled |

### Attendance

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/attendance/class/:classId` | Get class attendance | Teacher |
| POST | `/attendance` | Mark attendance | Teacher |
| GET | `/attendance/student/:studentId` | Get student attendance | Student/Teacher |

### Announcements

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/announcement/class/:classId` | Get class announcements | Enrolled |
| POST | `/announcement` | Create announcement | Teacher |
| PUT | `/announcement/:id` | Update announcement | Teacher |
| DELETE | `/announcement/:id` | Delete announcement | Teacher |

### AI Document Search

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/document` | Get all documents | Admin |
| GET | `/document/:id` | Get document by ID | Any |
| POST | `/document` | Create document with AI embedding | Admin |
| PUT | `/document/:id` | Update document | Admin |
| DELETE | `/document/:id` | Delete document | Admin |
| POST | `/document/search` | AI-powered semantic search | Any |

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
        "description": "Deep learning fundamentals...",
        "tags": ["AI", "Python", "DeepLearning"],
        "level": "Advanced",
        "fileUrl": "https://drive.google.com/...",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    }
  ],
  "count": 5
}
```

### Chat & Messaging

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/chat/conversations` | Get user conversations | Any |
| GET | `/chat/messages/:conversationId` | Get conversation messages | Participant |
| POST | `/chat/message` | Send message | Any |
| PUT | `/chat/message/:id/read` | Mark message as read | Recipient |

**Socket.IO Chat Events (Namespace: `/chat`)**:
```javascript
// Client → Server
socket.emit("sendMessage", { to: userId, content: "Hello" });
socket.emit("typing", { conversationId });
socket.emit("stopTyping", { conversationId });

// Server → Client
socket.on("messageReceived", (message) => {});
socket.on("userTyping", ({ userId, conversationId }) => {});
socket.on("userStoppedTyping", ({ userId, conversationId }) => {});
```

### Discussion Forums

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/topic` | Get all topics | Any |
| POST | `/topic` | Create topic | Admin |
| GET | `/post/topic/:topicId` | Get topic posts | Any |
| GET | `/post/:id` | Get post details | Any |
| POST | `/post` | Create post | Enrolled |
| PUT | `/post/:id` | Update post | Author |
| DELETE | `/post/:id` | Delete post | Author/Admin |
| GET | `/comment/post/:postId` | Get post comments | Any |
| POST | `/comment` | Add comment | Enrolled |
| PUT | `/comment/:id` | Update comment | Author |
| DELETE | `/comment/:id` | Delete comment | Author/Admin |

**Socket.IO Discussion Events (Namespace: `/`)**:
```javascript
// Real-time updates
socket.on("newComment", (comment) => {});
socket.on("newPost", (post) => {});
socket.on("postUpdate", (post) => {});
socket.on("deleteComment", (commentId) => {});
```

### LiveKit Video Conferencing

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/livekit/token` | Generate room token | Teacher/Student |
| POST | `/livekit/room/create` | Create video room | Teacher |
| POST | `/livekit/room/close` | End video room | Teacher |
| GET | `/livekit/participants/:roomName` | Get room participants | Teacher |
| POST | `/livekit/recording/start` | Start recording | Teacher |
| POST | `/livekit/recording/stop` | Stop recording | Teacher |

**LiveKit Token Request:**
```json
{
  "roomName": "CLASS-2024-CS101",
  "participantName": "John Doe",
  "isTeacher": true
}
```

**LiveKit Token Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "url": "wss://your-project.livekit.cloud"
}
```

### Recording Management

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/recording/class/:classId` | Get class recordings | Teacher/Enrolled |
| GET | `/recording/:id` | Get recording details | Teacher/Student |
| PUT | `/recording/:id/summary` | Update AI summary | Teacher |
| POST | `/recording/:id/publish` | Publish to students | Teacher |
| POST | `/webhook/livekit` | LiveKit webhook handler | System |

**Recording Object:**
```json
{
  "_id": "...",
  "roomName": "CS101-Lecture-5",
  "classId": "...",
  "teacherId": "...",
  "egressId": "EG_xxx",
  "recordingUrl": "https://s3.amazonaws.com/.../recording.mp4",
  "summaryTitle": "Introduction to Algorithms",
  "aiTranscript": "Today we covered...",
  "aiSummary": "# Key Points\n- Topic 1\n- Topic 2",
  "aiStatus": "COMPLETED",
  "isReviewed": true,
  "isPublished": true,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

### VoIP (SIP Integration)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/voip/teachers` | Get callable teachers | Student |
| POST | `/voip/call-log` | Log call history | Any |
| GET | `/voip/call-history` | Get user call history | Any |

### Teaching Schedule

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/schedule/class/:classId` | Get class schedule | Teacher/Student |
| POST | `/schedule` | Create schedule entry | Teacher |
| PUT | `/schedule/:id` | Update schedule | Teacher |
| DELETE | `/schedule/:id` | Delete schedule | Teacher |
| POST | `/schedule/:id/notify` | Send email notification | Teacher |

## 🧪 Testing

### Test Structure

```
backend/tests/
├── unit/
│   ├── services/          # Service layer tests (25+ files)
│   │   ├── userService.test.js
│   │   ├── commentService.test.js
│   │   ├── aiService.test.js
│   │   └── [22+ more]
│   └── utils/             # Utility function tests
│       ├── VectorSimilarity.test.js
│       └── token.test.js
└── integrations/
    └── routers/           # API endpoint tests
        └── [router tests]
```

### Running Tests

```bash
# All tests
npm test

# Unit tests only (Jest)
npm run test:unit

# Service tests (Vitest)
npm run test:services

# Integration tests
npm run test:integration

# Specific test file
npm run test:services -- commentService.test.js

# Watch mode
npm run test:services -- --watch

# Coverage report
npm test -- --coverage
```

### Test Configuration

**Jest** (`jest.config.js`):
```javascript
export default {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js"],
};
```

**Vitest** (`vitest.config.js`):
```javascript
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.vitest.js"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
```

### Example Test (Vitest)

```javascript
import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("../../../src/model/comment.js", () => ({
  default: {
    create: vi.fn(),
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

const commentService = await import("../../../src/service/commentService.js");
const Comment = (await import("../../../src/model/comment.js")).default;

describe("Comment Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new comment", async () => {
    const inputData = {
      content: "Great post!",
      post_id: "post1",
      user_id: "user1",
    };
    
    Comment.create.mockResolvedValue({ _id: "comment1", ...inputData });

    const result = await commentService.createComment(inputData);

    expect(Comment.create).toHaveBeenCalledWith(inputData);
    expect(result).toEqual({ _id: "comment1", ...inputData });
  });
});
```
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
socket.emit("send_message", {
  content: string,
  conversationId: string,
  receiverId: string,
});
```

**Server → Client**

```javascript
// Receive incoming message
socket.on("receive_message", (message) => {
  // message: { _id, sender, content, conversationId, createdAt }
});

// Confirmation of sent message
socket.on("message_sent", (finalMessage) => {
  // finalMessage: complete message object from DB
});

// Error handling
socket.on("error", (error) => {
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
socket.on("comment_added", (comment) => {
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
version: "3.8"
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

## 🧪 Testing

### Run All Tests

```bash
cd backend
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Watch Mode (Development)

```bash
npm run test:watch
```

### Test Categories

```bash
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:services      # Service layer
npm run test:controllers   # Controllers
npm run test:middlewares   # Middlewares
npm run test:models        # Database models
```

### Coverage Report

After running `npm run test:coverage`, open:

- **HTML Report**: `backend/coverage/lcov-report/index.html`
- **Terminal Summary**: Displayed automatically

### Test Structure

```
backend/
├── __tests__/
│   ├── integration/routes/  # API endpoint tests
│   ├── fixtures/            # Test data
│   └── setup.js             # Test utilities
└── src/
    ├── controller/__tests__/
    ├── middlewares/__tests__/
    ├── model/__tests__/
    ├── service/__tests__/     ✅ 20+ tests
    ├── utils/__tests__/       ✅ 3 tests
    └── validation/__tests__/
```

**📖 Full Testing Guide**: See [TESTING.md](TESTING.md)

## 📊 Performance Optimization

- **Pagination**: 10 items per page default
- **Database Indexes**: On email, title, tags, dates
- **Code Splitting**: React.lazy() for route components
- **Test Performance**: `--runInBand` flag for sequential execution
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
