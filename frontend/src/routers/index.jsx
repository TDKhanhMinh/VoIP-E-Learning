import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Attendance from "../pages/Student/Attendance";
import Notification from "../pages/Student/Notification";
import OnlineTest from "../pages/Student/OnlineTest";
import HomeworkLayout from "../layout/HomeworkLayout";
import HomeCourse from "../pages/Student/HomeCourse";
import Home from "../pages/Student/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Login";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManageClasses from './../pages/Admin/ManageClasses';
import ManageCourses from './../pages/Admin/ManageCourses';
import ManageSemester from './../pages/Admin/ManageSemesters';
import ManageUsers from './../pages/Admin/ManageUsers';
import TeacherDashboard from "../pages/Teacher/TeacherDashboard";
import ManageAssignments from "../pages/Teacher/ManageAssignments";
import ManageAttendance from "../pages/Teacher/ManageAttendance";
import ManageSubmissions from "../pages/Teacher/ManageSubmissions";
import TeacherClasses from "../pages/Teacher/TeacherClasses";
import TeacherClassDetails from "../pages/Teacher/TeacherClassDetails";
import TeacherLayout from "../layout/TeacherLayout";
import TeacherSchedule from "../pages/Teacher/TeacherSchedule";
import ClassDetail from "../pages/Admin/ManageClassDetails";
import ClassAssignment from "../pages/Teacher/ClassAssignment";
import ClassAttendance from "../pages/Teacher/ClassAttendance";
import ClassSubmission from "../pages/Teacher/ClassSubmission";
import Assignment from "../pages/Student/Assignment";
import TeacherManageSubmission from "../pages/Teacher/TeacherManagerSubmission";
import ManageNotifications from "../pages/Teacher/ManageNotifications";
import ClassNotification from "../pages/Teacher/ClassNotification";
import VideoRoom from "../components/VideoRoom";

const publicRoutes = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        index: true, element: <Login />
      },

    ],
  },
  {
    element: <MainLayout />,
    path: "home",
    children: [
      {
        index: true, element: <Home />
      },
      {
        path: "attendance", element: <Attendance />
      },
      {
        path: "notification", element: <Notification />
      },
      {
        path: "online-test", element: <OnlineTest />
      },
      {
        path: "video-conference", element: <VideoRoom />
      },
    ],
  },
  {
    element: <AdminLayout />,
    path: "admin",
    children: [
      {
        index: true, element: <AdminDashboard />
      },
      {
        path: "classes", element: <ManageClasses />
      },
      {
        path: "courses", element: <ManageCourses />
      },
      {
        path: "semesters", element: <ManageSemester />
      },
      {
        path: "users", element: <ManageUsers />
      },
      {
        path: "classes/class-details/:id", element: <ClassDetail />
      },
    ],
  },

  {
    element: <TeacherLayout />,
    path: "teacher",
    children: [
      {
        index: true, element: <TeacherDashboard />
      },
      {
        path: "assignments", element: <ManageAssignments />
      },
      {
        path: "attendances", element: <ManageAttendance />
      },
      {
        path: "submissions/:id", element: <ManageSubmissions />
      },
      {
        path: "submissions", element: <TeacherManageSubmission />
      },
      {
        path: "notifications", element: <ManageNotifications />
      },
      {
        path: "classes", element: <TeacherClasses />
      },
      {
        path: "schedule", element: <TeacherSchedule />
      },
      {
        path: "class-details/:id", element: <TeacherClassDetails />
      },
      {
        path: "class-details/:id/assignments", element: <ClassAssignment />
      },
      {
        path: "class-details/:id/notifications", element: <ClassNotification />
      },
      {
        path: "class-details/:id/attendance", element: <ClassAttendance />
      },
      {
        path: "class-details/:id/submissions", element: <ClassSubmission />
      },
    ],
  },
  {
    element: <HomeworkLayout />,
    path: "course",
    children: [
      {
        path: "home", element: <HomeCourse />
      },
      {
        path: "homework/:id", element: <Assignment />
      },

    ],
  },
])
const privateRoutes = []

export { publicRoutes, privateRoutes }