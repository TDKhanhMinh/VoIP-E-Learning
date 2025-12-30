import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { classService } from "../../services/classService";
import { BsCameraVideo } from "react-icons/bs";
import { announcementService } from "../../services/announcementService";
import NotificationItem from "../../components/Common/NotificationItem";
import CreatePostModal from "../../components/Modals/PostModal";
import { postService } from "../../services/postService";
import { io } from "socket.io-client";
import PostItem from "../../components/Common/PostItems";
import ChatWithTeacher from "../../components/Chat/ChatWithTeacher";
import { userService } from "../../services/userService";
import ClassDetailSkeleton from "./../../components/SkeletonLoading/ClassDetailSkeleton";
export default function ClassDetails() {
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [posts, setPosts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const socketRef = useRef(null);

  const user = {
    author_id: sessionStorage.getItem("userId")?.split('"').join("").toString(),
    author_name: sessionStorage.getItem("name"),
    token: localStorage.getItem("token"),
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [classDetails, notifs, postList] = await Promise.all([
          classService.getClassById(id),
          announcementService.getAnnouncementByClassId(id),
          postService.getPosts(id),
        ]);

        setClassInfo(classDetails);
        setNotifications(notifs);
        setPosts(postList);

        if (classDetails?.teacher) {
          const teacherInfo = await userService.getUserById(
            classDetails.teacher
          );
          setTeacher(teacherInfo);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu lớp học:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    if (user.token) {
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        query: { token: user.token, room: id },
      });

      socketRef.current.on("new_post", (post) => {
        setPosts((prev) => [post, ...prev]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  if (isLoading) return <ClassDetailSkeleton />;
  if (!classInfo || !user)
    return (
      <div className="p-6 text-center dark:text-gray-300">
        Không tìm thấy thông tin lớp học.
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div
        onClick={() => navigate(-1)}
        className="cursor-pointer text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 mb-4"
      >
        &larr; Quay lại
      </div>
      <div className="rounded-xl bg-blue-600 dark:bg-blue-700 shadow-lg">
        <div className="p-8 text-white">
          <h1 className="text-3xl font-bold truncate">{classInfo.name}</h1>
          <p className="text-lg mt-2 opacity-95">
            GV: {teacher?.full_name} <span className="mx-2">•</span>{" "}
            {classInfo.schedule
              ?.map((s) => `Thứ ${s.dayOfWeek} (Ca ${s.shift})`)
              .join(", ")}{" "}
            <span className="mx-2">•</span> Phòng {classInfo.room}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[25%_75%] gap-6 p-4 mt-2">
        <div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 shadow-sm mb-6">
            <div className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-3">
              <BsCameraVideo className="text-red-500 dark:text-red-400 text-lg" />{" "}
              Phòng học Online
            </div>
            <button
              onClick={() => navigate(`/meet-room/${id}`)}
              className="w-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-medium py-2 rounded-lg transition-colors"
            >
              Vào lớp ngay
            </button>
          </div>

          <ChatWithTeacher TEACHER_ID={teacher?._id} />
        </div>

        <div>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full text-white font-medium shadow-md transition-all hover:shadow-lg mb-6"
          >
            + Tạo thảo luận mới
          </button>

          {notifications.length > 0 || posts.length > 0 ? (
            <>
              <div className="space-y-4 mb-8">
                {notifications.map((a) => (
                  <NotificationItem key={a._id} data={a} />
                ))}
              </div>

              <div className="space-y-6">
                {posts.map((post) => (
                  <PostItem key={post._id} post={post} user={user} />
                ))}
              </div>
            </>
          ) : (
            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-800">
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Lớp học chưa có bài đăng nào
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Hãy là người đầu tiên bắt đầu cuộc thảo luận!
              </p>
            </div>
          )}
        </div>
      </div>

      <CreatePostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        classId={id}
        user={user}
      />
    </div>
  );
}
