import { Schema } from 'mongoose';

const objectId = (ref: string, required = false) => ({
  type: Schema.Types.ObjectId,
  ref,
  ...(required ? { required: true } : {}),
});

const announcementSchema = new Schema(
  {
    class: objectId('Class', true),
    title: { type: String, required: true },
    content: { type: String, default: null },
    created_by: objectId('User', true),
    file_url: { type: String, default: null },
    file_name: { type: String, default: null },
  },
  { timestamps: true, collection: 'announcements' },
);

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    class: objectId('Class', true),
    due_at: { type: Date },
  },
  { timestamps: true, collection: 'assignments' },
);

const attendanceSchema = new Schema(
  {
    class: objectId('Class', true),
    student: objectId('User', true),
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present',
    },
    lesson: { type: Number, required: true, default: 1 },
    attend_at: { type: Date, default: null },
  },
  { collection: 'attendances' },
);
attendanceSchema.index(
  { class: 1, student: 1, lesson: 1 },
  { unique: true, name: 'attendance_class_student_lesson_unique' },
);

const classScheduleSchema = new Schema(
  {
    dayOfWeek: { type: Number, required: true, enum: [2, 3, 4, 5, 6, 7] },
    shift: { type: Number, required: true, enum: [1, 2, 3, 4] },
    type: { type: String, required: true, enum: ['theory', 'practice'] },
    room: { type: String, required: true },
  },
  { _id: false },
);
const classSchema = new Schema(
  {
    name: { type: String, required: true },
    schedule: {
      type: [classScheduleSchema],
      required: true,
      validate: [
        (items: unknown[]) => items.length > 0,
        'Schedule must contain at least one session.',
      ],
    },
    course: objectId('Course', true),
    semester: objectId('Semester', true),
    teacher: objectId('User', true),
    theoryWeeks: { type: Number, required: true, min: 0 },
    practiceWeeks: { type: Number, min: 0 },
    absent: [{ date: { type: Date, required: true } }],
  },
  { collection: 'classes' },
);

const classStudentSchema = new Schema(
  {
    class: objectId('Class', true),
    student: objectId('User', true),
    joined_at: { type: Date },
  },
  { collection: 'classstudents' },
);

const commentSchema = new Schema(
  {
    post_id: { type: String, required: true },
    author_id: { type: String, required: true },
    author_name: String,
    content: String,
  },
  { timestamps: true, collection: 'comments' },
);
commentSchema.index(
  { post_id: 1, createdAt: -1 },
  { name: 'comments_post_created_at' },
);

const conversationSchema = new Schema(
  {
    participants: [objectId('User')],
    type: { type: String, enum: ['private', 'group'], default: 'private' },
    lastMessage: objectId('Message'),
  },
  { timestamps: true, collection: 'conversations' },
);

const documentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', ''],
      default: '',
    },
    link: { type: String, default: '' },
    embedding: { type: [Number], required: true },
    titleEmbedding: { type: [Number], default: null },
    tagsEmbedding: { type: [Number], default: null },
    levelEmbedding: { type: [Number], default: null },
    descriptionEmbedding: { type: [Number], default: null },
  },
  { timestamps: true, collection: 'documents' },
);
documentSchema.index({ title: 1 }, { name: 'documents_title' });
documentSchema.index({ tags: 1 }, { name: 'documents_tags' });
documentSchema.index({ level: 1 }, { name: 'documents_level' });

const materialSchema = new Schema(
  {
    title: { type: String, required: true },
    file_url: { type: String, required: true },
    class: objectId('Class', true),
    upload_by: objectId('User', true),
  },
  { timestamps: true, collection: 'materials' },
);
materialSchema.index(
  { class: 1, createdAt: -1 },
  { name: 'materials_class_created_at' },
);

const messageSchema = new Schema(
  {
    conversation: objectId('Conversation', true),
    sender: objectId('User', true),
    receiver: objectId('User', true),
    messageType: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'messages' },
);

const onlineTestSchema = new Schema(
  {
    class: objectId('Class'),
    teacher: objectId('User', true),
    title: { type: String, required: true },
    available: { type: Boolean, default: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    time: { type: String, required: true },
    attempts: { type: Number, required: true },
    description: String,
    shuffle: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    totalQuestions: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'onlinetests' },
);

const postSchema = new Schema(
  {
    class_id: String,
    topic_id: objectId('Topic'),
    author_id: { type: String, required: true },
    author_name: String,
    content: String,
    title: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true, collection: 'posts' },
);
postSchema.index({ class_id: 1, topic_id: 1 }, { name: 'posts_class_topic' });
postSchema.index(
  { topic_id: 1, createdAt: -1 },
  { name: 'posts_topic_created_at' },
);
postSchema.index({ created_by: 1 }, { name: 'posts_created_by_legacy' });

const recordLessonSummarySchema = new Schema(
  {
    roomName: { type: String, required: true },
    classId: objectId('Class', true),
    teacherId: objectId('User', true),
    createdBy: { type: String, required: true },
    egressId: { type: String },
    recordingUrl: String,
    summaryTitle: { type: String, default: '' },
    aiTranscript: { type: String, default: '' },
    aiSummary: { type: String, default: '' },
    aiStatus: {
      type: String,
      enum: ['IDLE', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'IDLE',
    },
    isReviewed: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    aiError: String,
  },
  { timestamps: true, collection: 'recordlessonsummaries' },
);
recordLessonSummarySchema.index(
  { roomName: 1 },
  { name: 'recordlessonsummaries_room_name' },
);
recordLessonSummarySchema.index(
  { classId: 1 },
  { name: 'recordlessonsummaries_class_id' },
);
recordLessonSummarySchema.index(
  { teacherId: 1 },
  { name: 'recordlessonsummaries_teacher_id' },
);
recordLessonSummarySchema.index(
  { createdBy: 1 },
  { name: 'recordlessonsummaries_created_by' },
);
recordLessonSummarySchema.index(
  { egressId: 1 },
  { unique: true, name: 'recordlessonsummaries_egress_id_unique' },
);
recordLessonSummarySchema.index(
  { isPublished: 1 },
  { name: 'recordlessonsummaries_is_published' },
);

const roomParticipantSchema = new Schema({
  userId: objectId('User'),
  email: String,
  name: String,
  role: { type: String, enum: ['teacher', 'student'], default: 'student' },
  joinedAt: { type: Date, default: Date.now },
  leftAt: Date,
  duration: Number,
});
const roomSchema = new Schema(
  {
    classId: objectId('Class', true),
    teacherId: objectId('User'),
    teacherEmail: String,
    teacherName: String,
    roomName: { type: String },
    joinCode: { type: String },
    createdAt: { type: Date, default: Date.now },
    startedAt: Date,
    endedAt: Date,
    status: { type: String, enum: ['active', 'ended'], default: 'active' },
    participants: [roomParticipantSchema],
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true, collection: 'rooms' },
);
roomSchema.index(
  { roomName: 1 },
  { unique: true, name: 'rooms_room_name_unique' },
);
roomSchema.index(
  { joinCode: 1 },
  { unique: true, name: 'rooms_join_code_unique' },
);

const semesterSchema = new Schema(
  {
    name: { type: String, required: true },
    start_date: Date,
    end_date: Date,
    mid_term: { start_date: Date, end_date: Date },
  },
  { timestamps: true, collection: 'semesters' },
);
semesterSchema.index(
  { name: 1 },
  { unique: true, name: 'semesters_name_unique' },
);

const submissionSchema = new Schema(
  {
    assignment: objectId('Assignment', true),
    student: objectId('User', true),
    file_url: { type: String, required: true },
    file_name: String,
    score: { type: Number, default: 0, min: 0, max: 10 },
    feedback: { type: String, default: null },
    graded: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'submissions' },
);

const teachingScheduleSchema = new Schema(
  {
    class: objectId('Class', true),
    teacher: objectId('User', true),
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['SCHEDULED', 'COMPLETED', 'ABSENT'],
      default: 'SCHEDULED',
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { collection: 'teachingschedules' },
);

const testAttemptSchema = new Schema(
  {
    student: objectId('User', true),
    onlineTest: objectId('OnlineTest', true),
    score: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    submitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'testattempts' },
);

const testQuestionOptionSchema = new Schema({
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});
const testQuestionSchema = new Schema(
  {
    test: objectId('OnlineTest', true),
    question: { type: String, required: true },
    options: [testQuestionOptionSchema],
    image: { type: String, default: null },
  },
  { collection: 'testquestions' },
);

const testSessionOptionSchema = new Schema({
  optionId: Schema.Types.ObjectId,
  answer: String,
});
const testSessionQuestionSchema = new Schema({
  questionId: objectId('Question'),
  question: String,
  image: String,
  options: [testSessionOptionSchema],
  selectedOptionId: { type: Schema.Types.ObjectId, default: null },
});
const testSessionSchema = new Schema(
  {
    test: objectId('OnlineTest'),
    student: objectId('User'),
    startedAt: Date,
    remainingTime: Number,
    questions: [testSessionQuestionSchema],
    finished: { type: Boolean, default: false },
  },
  { collection: 'testsessions' },
);

const topicSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true, collection: 'topics' },
);

export const V1_MODEL_DEFINITIONS = [
  { name: 'Announcement', schema: announcementSchema },
  { name: 'Assignment', schema: assignmentSchema },
  { name: 'Attendance', schema: attendanceSchema },
  { name: 'Class', schema: classSchema },
  { name: 'ClassStudent', schema: classStudentSchema },
  { name: 'Comment', schema: commentSchema },
  { name: 'Conversation', schema: conversationSchema },
  { name: 'Document', schema: documentSchema },
  { name: 'Material', schema: materialSchema },
  { name: 'Message', schema: messageSchema },
  { name: 'OnlineTest', schema: onlineTestSchema },
  { name: 'Post', schema: postSchema },
  { name: 'RecordLessonSummary', schema: recordLessonSummarySchema },
  { name: 'Room', schema: roomSchema },
  { name: 'Semester', schema: semesterSchema },
  { name: 'Submission', schema: submissionSchema },
  { name: 'TeachingSchedule', schema: teachingScheduleSchema },
  { name: 'TestAttempt', schema: testAttemptSchema },
  { name: 'TestQuestion', schema: testQuestionSchema },
  { name: 'TestSession', schema: testSessionSchema },
  { name: 'Topic', schema: topicSchema },
] as const;

export type V1PersistenceModelName =
  (typeof V1_MODEL_DEFINITIONS)[number]['name'];

export const v1ModelDefinitionsFor = (
  names: readonly V1PersistenceModelName[],
) => {
  const requestedNames = new Set(names);
  return V1_MODEL_DEFINITIONS.filter((definition) =>
    requestedNames.has(definition.name),
  );
};
