# VoIP E-Learning System

A modern, full-featured Learning Management System (LMS) with integrated VoIP communication capabilities, real-time video conferencing, and comprehensive educational tools built for Ton Duc Thang University.

![E-Learning System](https://res.cloudinary.com/dsj6sba9f/image/upload/v1745247841/c085ad076c442c8191e6b7f48ef59aad_k7izor.jpg)

## Overview

VoIP E-Learning is a comprehensive educational platform that combines traditional LMS features with advanced real-time communication capabilities. The system provides seamless integration of course management, online assessments, video conferencing, VoIP calling, and collaborative learning tools.

### Key Highlights

- **Real-time VoIP Communication**: Direct SIP-based calling between students and teachers using SIP.js
- **Video Conferencing**: LiveKit-powered virtual classrooms with interactive whiteboard (Tldraw)
- **Online Testing**: Advanced testing system with auto-grading, multiple attempts, and scheduled activation
- **Assignment Management**: Complete workflow from creation to submission and grading
- **Discussion Forums**: Topic-based discussions with nested comments and real-time updates
- **File Management**: Google Drive integration for materials and Cloudinary for images
- **Live Chat**: Socket.IO powered real-time messaging with conversation tracking

## Features

### Educational Features

#### Class & Course Management
- **Semester-based Organization**: Classes organized by academic terms (HK1-2024/2025, HK2-2024/2025)
- **Multi-class Enrollment**: Students can enroll in multiple classes per semester
- **Course Materials Library**: Google Drive integration for uploading and sharing resources
- **Schedule Management**: Support for theory and practice sessions with day/shift scheduling
- **Attendance Tracking**: Digital check-in system with session-based attendance

#### Online Testing System
- **Test Creation**: Flexible configuration with title, description, time limits, and attempt limits
- **Question Bank**: Multiple-choice questions with import from .docx files using Mammoth
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

### Communication Features

#### VoIP Calling (SIP.js Integration)
- **Direct Calling**: Student-to-teacher voice calls via WebRTC
- **Session Management**: Proper handling of incoming, outgoing, and active calls
- **Call States**: Real-time state tracking (idle, calling, in-call, terminated)
- **Audio Streaming**: Remote audio playback through HTML5 audio elements
- **STUN/TURN Servers**: Configured for NAT traversal
  ```javascript
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
- **Session Recording**: Optional recording capabilities (LiveKit feature)

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

### User Roles & Permissions

#### Admin
- Complete system management dashboard
- User CRUD operations (students, teachers, admins)
- Course and class creation with semester assignment
- Class enrollment management
- Semester lifecycle management
- System-wide analytics and reporting
- Chat support interface for all users

#### Teacher
- Assigned class management
- Assignment creation with deadlines
- Online test design with question banks
- Material uploads to Google Drive
- Submission grading with feedback
- Attendance tracking per session
- Announcements to class
- Video conference hosting with whiteboard
- Student chat support

#### Student
- View enrolled classes per semester
- Submit assignments before deadlines
- Take scheduled online tests
- Access course materials and resources
- Participate in discussion forums
- Join video conferences when active
- VoIP calling to assigned teachers
- Real-time chat with admin/teachers

## Technology Stack

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

**File Storage & Processing**
- Multer 1.4.5-lts.1 (file uploads)
- Google APIs (googleapis 144.0.0) (Drive integration)
- Cloudinary 2.6.0 (image storage)
- Mammoth 1.8.0 (Word document parsing)

**Task Scheduling**
- node-cron 3.0.3 (scheduled jobs)

**Utilities**
- Moment.js 2.30.1 (date/time)
- Moment-timezone 0.5.46 (timezone handling)
- Crypto (native, UUID generation)

**Development**
- Nodemon 3.1.9 (auto-restart)
- ESLint (code quality)

## Project Structure

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
│   │   │   │   └── LoaderOverlay.jsx
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
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── Teacher/
│   │   │   │   ├── ClassDetails.jsx
│   │   │   │   └── GradeSubmissions.jsx
│   │   │   ├── Student/
│   │   │   │   ├── ClassDetails.jsx
│   │   │   │   └── TakeTest.jsx
│   │   │   └── Login.jsx
│   │   ├── services/           # API service layer
│   │   │   ├── authService.js
│   │   │   ├── chatService.js
│   │   │   ├── classService.js
│   │   │   ├── enrollmentService.js
│   │   │   ├── roomService.js
│   │   │   ├── sipClientService.js
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
    │   │   └── [others...]
    │   ├── router/
    │   │   ├── authRouter.js
    │   │   ├── chatRouter.js
    │   │   ├── classRouter.js
    │   │   ├── voipRouter.js
    │   │   ├── livekitRouter.js
    │   │   ├── testOnlineRouter.js
    │   │   └── [others...]
    │   ├── service/
    │   │   ├── authService.js
    │   │   ├── chatService.js
    │   │   ├── driveService.js        # Google Drive API
    │   │   ├── postService.js
    │   │   └── testService.js
    │   ├── sockets/
    │   │   ├── chatSocket.js          # Chat namespace
    │   │   └── discussionSocket.js    # Discussion events
    │   └── server.js                  # Express server
    └── package.json
```

## Installation & Setup

### Prerequisites

- **Node.js**: v20.x or higher
- **MongoDB**: v6.x or higher
- **Google Cloud Project**: For Drive API credentials
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

# Google OAuth (optional for Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Google Drive API Setup**

- Create project in [Google Cloud Console](https://console.cloud.google.com)
- Enable Google Drive API
- Create service account
- Download credentials JSON
- Place as `src/config/credentials.json`
- Share Drive folder with service account email

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

## Configuration Details

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

**Update these values for your SIP infrastructure:**
- STUN server for public IP discovery
- TURN server for NAT traversal (UDP/TCP/TLS)
- Credentials for TURN authentication

### CORS Configuration (server.js)

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://voip-e-learning-1.onrender.com",
  "https://meet.livekit.io",
  "http://localhost:5000",
];
```

Add your production domain to this list.

### Socket.IO Namespaces

- **Chat Namespace**: `/chat` - JWT-authenticated real-time messaging
- **Default Namespace**: `/` - Discussion forums and general events

### Google Drive Parent Folder

Located in `driveService.js`:
```javascript
const PARENT_FOLDER_ID = "1nQTKksCVedKtt0hJqWyZQ8T57EMmjR0P";
```

Update with your shared Drive folder ID.

## API Documentation

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

## Socket.IO Events

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

## Usage Guide

### For Students

1. **Login** with student credentials at `/login`
2. **Dashboard** redirects to `/home` showing enrolled classes
3. **View Classes**: Sidebar lists all classes for current semester
4. **Assignments**: 
   - Navigate to class details
   - View assignment list with deadlines
   - Submit files via drag-and-drop
   - Check grades and feedback
5. **Tests**: 
   - Take tests during scheduled periods
   - View remaining time and attempts
   - Auto-submit on timeout
6. **Materials**: Download course resources from Google Drive
7. **Communication**:
   - **Chat**: Click support widget to message admin/teacher
   - **VoIP Call**: Use "Call Teacher" button for voice communication
   - **Video**: Join conference when teacher starts session
8. **Discussions**: Post questions and reply to classmates

### For Teachers

1. **Login** to teacher dashboard at `/teacher`
2. **Manage Classes**: View assigned classes in sidebar
3. **Create Content**:
   - **Materials**: Upload files to Google Drive
   - **Assignments**: Set title, description, deadline
   - **Tests**: 
     - Create test with time limit and attempts
     - Add questions manually or import .docx
     - Schedule start/end times
4. **Grade Work**: 
   - Review submissions
   - Assign numeric grades
   - Provide text feedback
5. **Attendance**: Mark students present/absent per session
6. **Video Conferences**:
   - Start LiveKit session from class page
   - Toggle interactive whiteboard
   - Share screen
   - Mute all participants
   - End session
7. **Support**: Respond to student messages and calls

### For Admins

1. **Login** to admin panel at `/admin`
2. **User Management**:
   - Create students, teachers, admins
   - Edit user profiles
   - Delete users
3. **Course Setup**:
   - Create semesters (e.g., HK1-2024/2025)
   - Define courses with credits
   - Create classes with schedules
4. **Class Configuration**:
   - Assign teachers to classes
   - Enroll students in bulk or individually
   - Manage class schedules (day, shift)
5. **Monitoring**: View system-wide statistics
6. **Chat Support**: Handle student inquiries via admin chat

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth with expiration
- **Protected Routes**: Middleware-enforced access control
- **CORS Protection**: Whitelist-based origin validation
- **Input Validation**: express-validator for all inputs
- **File Type Restrictions**: Whitelist for uploads (.pdf, .docx, .jpg, etc.)
- **File Size Limits**: Configurable max upload size
- **XSS Protection**: Content sanitization
- **SQL Injection Prevention**: Mongoose ODM with parameterized queries
- **Socket Authentication**: JWT verification for Socket.IO connections

## Scheduled Tasks (Cron Jobs)

### Test Status Update
**Schedule**: Every minute (`* * * * *`)
**File**: `cron/updateOnlineTest.js`
**Purpose**: Automatically update test status:
- `not_started` → `ongoing` (when current time reaches start time)
- `ongoing` → `ended` (when current time passes end time)

### Auto Submit Test Sessions
**Schedule**: Every minute (`* * * * *`)
**File**: `cron/submitTestSession.js`
**Purpose**: Force submit test sessions when:
- Time limit expires
- Test ends
- Student hasn't submitted

## UI/UX Features

- **Responsive Design**: Mobile-friendly with TailwindCSS
- **Animations**: Smooth transitions with Framer Motion
- **Loading States**: Skeleton screens and spinners
- **Toast Notifications**: React Toastify for user feedback
- **Modals**: Headless UI for accessible dialogs
- **Tooltips**: Tippy.js for contextual help
- **Drag & Drop**: React Dropzone for file uploads
- **Rich Text**: React Quill for formatted content
- **Collapsible Sidebar**: Space-efficient navigation
- **Theme Colors**: Blue primary with gradient accents

## Database Schema

### Key Collections

**Users**
```javascript
{
  email: String (unique),
  password: String (hashed),
  full_name: String,
  role: Enum ['admin', 'teacher', 'student'],
  phone: String,
  address: String
}
```

**Classes**
```javascript
{
  name: String,
  course: ObjectId (ref: Course),
  teacher: ObjectId (ref: User),
  semester: ObjectId (ref: Semester),
  schedule: [{ dayOfWeek, shift }]
}
```

**OnlineTests**
```javascript
{
  title: String,
  description: String,
  class: ObjectId,
  start: Date,
  end: Date,
  time: Number (minutes),
  attempts: Number,
  status: Enum ['not_started', 'ongoing', 'ended']
}
```

**TestSessions**
```javascript
{
  student: ObjectId,
  test: ObjectId,
  startTime: Date,
  endTime: Date,
  status: Enum ['in_progress', 'submitted', 'auto_submitted'],
  attempts: Number,
  bestScore: Number
}
```

**Conversations**
```javascript
{
  participants: [ObjectId],
  lastMessage: ObjectId,
  unreadCount: Map<String, Number>
}
```

## Testing

### Manual Testing Checklist

**Authentication**
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token expiration handling

**Assignments**
- [ ] Create assignment
- [ ] Submit before deadline
- [ ] Submit after deadline
- [ ] Grade submission
- [ ] File upload/download

**Online Tests**
- [ ] Create test with questions
- [ ] Import questions from .docx
- [ ] Take test within time limit
- [ ] Auto-submit on timeout
- [ ] Multiple attempts
- [ ] View results

**VoIP & Video**
- [ ] Initiate voice call
- [ ] Accept/reject incoming call
- [ ] Join video conference
- [ ] Toggle whiteboard
- [ ] Screen sharing

**Chat**
- [ ] Send message
- [ ] Receive message
- [ ] Mark as read
- [ ] Unread counter

## Troubleshooting

### Common Issues

**VoIP Call Fails**
- Check browser microphone permissions
- Verify TURN server credentials
- Ensure firewall allows WebRTC ports
- Test with different browser

**Video Conference Black Screen**
- Allow camera/microphone access
- Check LiveKit credentials in `.env`
- Verify LiveKit URL format
- Try refreshing page

**File Upload Fails**
- Check Google Drive API quota
- Verify service account permissions
- Ensure file size within limits
- Check Drive folder ID

**Socket.IO Disconnects**
- Verify CORS configuration
- Check JWT token validity
- Ensure stable network connection
- Review server logs

**Test Auto-Submit Not Working**
- Check cron job is running
- Verify server time synchronization
- Review `updateOnlineTest.js` logs
- Ensure MongoDB connection

**MongoDB Connection Error**
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Restart if needed
sudo systemctl restart mongod
```

**Port Already in Use**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill process
kill -9 <PID>
```

## Deployment

### Backend Deployment (Render)

1. **Environment Variables**: Set all `.env` variables in hosting platform
2. **MongoDB**: Use MongoDB Atlas for cloud database
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Port**: Use `process.env.PORT`

### Frontend Deployment (Render)

1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. **Environment Variables**: Set `VITE_*` variables
4. **Redirects**: Configure for SPA routing
5. **CORS**: Update backend allowedOrigins

### Production Checklist

- [ ] Update `NODE_ENV=production`
- [ ] Set strong `JWT_SECRET`
- [ ] Configure production MongoDB URI
- [ ] Update CORS allowed origins
- [ ] Enable HTTPS
- [ ] Configure CDN for static assets
- [ ] Set up error logging (Sentry)
- [ ] Configure backup strategy
- [ ] Monitor cron jobs
- [ ] Test all features end-to-end

## Performance Optimization

- **Pagination**: All list views support pagination (10 items/page)
- **Image Optimization**: Cloudinary automatic optimization
- **Database Indexing**: Indexes on frequently queried fields
- **Code Splitting**: React lazy loading for routes
- **API Caching**: Conditional requests with ETags
- **Socket.IO Rooms**: Efficient event broadcasting
- **File Streaming**: Chunked uploads for large files
- **Lazy Loading**: Images and components load on demand

## Browser Support

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+
- IE 11 (not supported)

**WebRTC Requirements**: Modern browser with WebRTC support

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

### Code Style

- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## Educational Context

Built for **Ton Duc Thang University** to modernize online education with:
- Seamless voice/video communication
- Automated assessment workflows
- Real-time collaboration tools
- Comprehensive learning analytics

## Team & Credits

- **University**: Ton Duc Thang University
- **Technologies**: React, Node.js, MongoDB, LiveKit, SIP.js
- **Icons**: Ton Duc Thang University logo
- **Infrastructure**: Google Drive, Cloudinary, LiveKit Cloud

## Support

- **Email**: support@voipelearning.shop
- **Issues**: GitHub Issues
- **Documentation**: This README

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] AI-powered grading assistance
- [ ] Plagiarism detection
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] SSO integration (OAuth2)
- [ ] Calendar integration
- [ ] Push notifications
- [ ] Dark mode
- [ ] Export reports (PDF/Excel)
- [ ] Gamification (badges, leaderboards)
- [ ] Parent portal
- [ ] Integration with external LMS (Moodle, Canvas)

---

**Built with for modern education**

© 2025 VoIP E-Learning System | Ton Duc Thang University
