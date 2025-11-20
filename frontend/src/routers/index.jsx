import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Attendance from "../pages/Student/Attendance";
import Notification from "../pages/Student/Notification";
import OnlineTest from "../pages/Student/OnlineTest";
import HomeworkLayout from "../layout/HomeworkLayout";
import ForumLayout from "../layout/ForumLayout";
import HomeCourse from "../pages/Student/HomeCourse";
import Home from "../pages/Student/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Login";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManageClasses from "./../pages/Admin/ManageClasses";
import ManageCourses from "./../pages/Admin/ManageCourses";
import ManageSemester from "./../pages/Admin/ManageSemesters";
import ManageUsers from "./../pages/Admin/ManageUsers";
import TeacherDashboard from "../pages/Teacher/TeacherDashboard";
import ManageAssignments from "../pages/Teacher/ManageAssignments";
import ManageTest from "../pages/Teacher/ManageTest";
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
import OnlineClassroom from "../pages/VoIP/OnlineClassroom";
import ClassDetails from "../pages/Student/ClassDetails";
import ManageChats from "../pages/Admin/ManageChats";
import ClassTest from "../pages/Teacher/ClassTest";
import ExamScreen from "../pages/Student/ExamScreen";
import TestQuestion from "../pages/Teacher/TestQuestion";
import TestResult from "../pages/Teacher/TestResult";
import Forum from "../components/Forum";
import { MdOutlineForum } from "react-icons/md";

const publicRoutes = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "meet-room/:id",
        element: <OnlineClassroom />,
      },
    ],
  },
  {
    element: <AdminLayout />,
    path: "admin",
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "classes",
        element: <ManageClasses />,
      },
      {
        path: "courses",
        element: <ManageCourses />,
      },
      {
        path: "semesters",
        element: <ManageSemester />,
      },
      {
        path: "users",
        element: <ManageUsers />,
      },
      {
        path: "chats",
        element: <ManageChats />,
      },
      {
        path: "classes/class-details/:id",
        element: <ClassDetail />,
      },
      {
        path: "forum",
        element: <Forum />,
      },
    ],
  },

  {
    element: <TeacherLayout />,
    path: "teacher",
    children: [
      {
        index: true,
        element: <TeacherDashboard />,
      },
      {
        path: "assignments",
        element: <ManageAssignments />,
      },
      {
        path: "attendances",
        element: <ManageAttendance />,
      },

      {
        path: "forum",
        element: <Forum />,
        icon: MdOutlineForum,
      },

      {
        path: "test-results/:testId",
        element: <TestResult />,
      },
      {
        path: "tests",
        element: <ManageTest />,
      },
      {
        path: "submissions/:id",
        element: <ManageSubmissions />,
      },
      {
        path: "submissions",
        element: <TeacherManageSubmission />,
      },
      {
        path: "notifications",
        element: <ManageNotifications />,
      },
      {
        path: "classes",
        element: <TeacherClasses />,
      },
      {
        path: "schedule",
        element: <TeacherSchedule />,
      },
      {
        path: "class-details/:id",
        element: <TeacherClassDetails />,
      },
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
      {
        path: "class-details/:id/tests",
        element: <ClassTest />,
      },
      {
        path: "class-details/:id/tests/:testId",
        element: <TestQuestion />,
      },
    ],
  },
  {
    element: <MainLayout />,
    path: "home",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "notification",
        element: <Notification />,
      },
      {
        path: "online-test",
        element: <OnlineTest />,
      },
      {
        path: "class-details/:id",
        element: <ClassDetails />,
      },
      {
        path: "exam/:test_id",
        element: <ExamScreen />,
      },
      {
        path: "forum",
        element: <Forum />,
      },
    ],
  },
  {
    element: <HomeworkLayout />,
    path: "course",
    children: [
      {
        path: "home",
        element: <HomeCourse />,
      },
      {
        path: "homework/:id",
        element: <Assignment />,
      },
    ],
  },
]);
const privateRoutes = [];

export { publicRoutes, privateRoutes };
