import { createBrowserRouter, Navigate } from "react-router-dom";
// LAYOUTS
import MainLayout from "../layout/MainLayout";
import HomeworkLayout from "../layout/HomeworkLayout";
import ForumLayout from "../layout/ForumLayout";
import AuthLayout from "../layout/AuthLayout";
import AdminLayout from "../layout/AdminLayout";
import TeacherLayout from "../layout/TeacherLayout";
import Login from "../pages/Login";
import OnlineClassroom from "../pages/VoIP/OnlineClassroom";
import Home from "../pages/Student/Home";
import Attendance from "../pages/Student/Attendance";
import Notification from "../pages/Student/Notification";
import OnlineTest from "../pages/Student/OnlineTest";
import HomeCourse from "../pages/Student/HomeCourse";
import ClassDetails from "../pages/Student/ClassDetails";
import ExamScreen from "../pages/Student/ExamScreen";
import Assignment from "../pages/Student/Assignment";
import ManageTeacherChats from "../pages/Student/ManageTeacherChats";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManageClasses from "./../pages/Admin/ManageClasses";
import ManageCourses from "./../pages/Admin/ManageCourses";
import ManageSemester from "./../pages/Admin/ManageSemesters";
import ManageUsers from "./../pages/Admin/ManageUsers";
import ManageChats from "../pages/Admin/ManageChats";
import ClassDetail from "../pages/Admin/ManageClassDetails";
import Forum from "../components/Forum";
import TeacherDashboard from "../pages/Teacher/TeacherDashboard";
import ManageAssignments from "../pages/Teacher/ManageAssignments";
import ManageTest from "../pages/Teacher/ManageTest";
import ManageAttendance from "../pages/Teacher/ManageAttendance";
import ManageSubmissions from "../pages/Teacher/ManageSubmissions";
import TeacherClasses from "../pages/Teacher/TeacherClasses";
import TeacherClassDetails from "../pages/Teacher/TeacherClassDetails";
import TeacherSchedule from "../pages/Teacher/TeacherSchedule";
import ClassAssignment from "../pages/Teacher/ClassAssignment";
import ClassAttendance from "../pages/Teacher/ClassAttendance";
import ClassSubmission from "../pages/Teacher/ClassSubmission";
import TeacherManageSubmission from "../pages/Teacher/TeacherManagerSubmission";
import ManageNotifications from "../pages/Teacher/ManageNotifications";
import ClassNotification from "../pages/Teacher/ClassNotification";
import ClassTest from "../pages/Teacher/ClassTest";
import TestQuestion from "../pages/Teacher/TestQuestion";
import TestResult from "../pages/Teacher/TestResult";
import ManageStudentsChats from "../pages/Teacher/ManageStudentsChats";
import AdminGuard from "./../pages/Admin/AdminGuard";
import AuthGuard from "../pages/Student/AuthGuard";
import LMS404Page from "../pages/LMS404Page";
import TeacherGuard from "../pages/Teacher/TeacherGuard";
import Schedule from "../pages/Schedule";

const publicRoutes = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "meet-room/:id",
    element: <OnlineClassroom />,
  },
  {
    element: <ForumLayout />,
    path: "forum",
  },

  {
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        path: "admin",
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "classes", element: <ManageClasses /> },
          { path: "courses", element: <ManageCourses /> },
          { path: "semesters", element: <ManageSemester /> },
          { path: "users", element: <ManageUsers /> },
          { path: "chats", element: <ManageChats /> },
          { path: "classes/class-details/:id", element: <ClassDetail /> },
          { path: "forum", element: <Forum /> },
        ],
      },
    ],
  },

  {
    element: <TeacherGuard />,
    children: [
      {
        element: <TeacherLayout />,
        path: "teacher",
        children: [
          { index: true, element: <TeacherDashboard /> },
          { path: "assignments", element: <ManageAssignments /> },
          { path: "attendances", element: <ManageAttendance /> },
          { path: "forum", element: <Forum /> },
          { path: "test-results/:testId", element: <TestResult /> },
          { path: "tests", element: <ManageTest /> },
          { path: "submissions/:id", element: <ManageSubmissions /> },
          { path: "chat", element: <ManageStudentsChats /> },
          { path: "submissions", element: <TeacherManageSubmission /> },
          { path: "notifications", element: <ManageNotifications /> },
          { path: "classes", element: <TeacherClasses /> },
          { path: "schedule", element: <TeacherSchedule /> },
          { path: "class-details/:id", element: <TeacherClassDetails /> },
          {
            path: "class-details/:id/assignments",
            element: <ClassAssignment />,
          },
          {
            path: "class-details/:id/notifications",
            element: <ClassNotification />,
          },
          {
            path: "class-details/:id/attendance",
            element: <ClassAttendance />,
          },
          {
            path: "class-details/:id/submissions",
            element: <ClassSubmission />,
          },
          { path: "class-details/:id/tests", element: <ClassTest /> },
          {
            path: "class-details/:id/tests/:testId",
            element: <TestQuestion />,
          },
        ],
      },
    ],
  },

  {
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        path: "home",
        children: [
          { index: true, element: <Home /> },
          { path: "attendance", element: <Attendance /> },
          { path: "chat", element: <ManageTeacherChats /> },
          { path: "notification", element: <Notification /> },
          { path: "online-test", element: <OnlineTest /> },
          { path: "class-details/:id", element: <ClassDetails /> },
          { path: "exam/:test_id", element: <ExamScreen /> },
          { path: "schedule", element: <Schedule /> },
          { path: "forum", element: <Forum /> },
        ],
      },
      {
        element: <HomeworkLayout />,
        path: "course",
        children: [
          { path: "home", element: <HomeCourse /> },
          { path: "homework/:id", element: <Assignment /> },
        ],
      },
    ],
  },

  {
    path: "/404",
    element: <LMS404Page />,
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
]);

const privateRoutes = [];

export { publicRoutes, privateRoutes };
