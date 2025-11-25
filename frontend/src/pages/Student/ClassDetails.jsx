import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { classService } from "../../services/classService";
import { BsCameraVideo, BsChat } from "react-icons/bs";
import { announcementService } from "../../services/announcementService";
import NotificationItem from "../../components/NotificationItem";
import CreatePostModal from "../../components/PostModal";
import { postService } from "../../services/postService";
import { io } from "socket.io-client";
import PostItem from "../../components/PostItems";
import ChatWithTeacher from "../../components/ChatWithTeacher";
import { userService } from "../../services/userService";
export default function ClassDetails() {
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const user = {
    author_id: sessionStorage.getItem("userId").split('"').join("").toString(),
    author_name: sessionStorage.getItem("name"),
    token: localStorage.getItem("token"),
  };
  const socket = io(import.meta.env.VITE_API_URL, {
    query: { token: user.token, room: id },
  });
  const navigate = useNavigate();
  useEffect(() => {
    loadClassDetail();
    const fetchPosts = async () => {
      setPosts(await postService.getPosts(id));
    };
    socket.on("new_post", (post) => {
      setPosts((prev) => [post, ...prev]);
    });
    fetchPosts();
  }, [id, socket]);

  const loadClassDetail = async () => {
    try {
      setNotifications(await announcementService.getAnnouncementByClassId(id));
      console.log(
        "Notifications ",
        await announcementService.getAnnouncementByClassId(id)
      );
      const classDetails = await classService.getClassById(id);
      setClassInfo(classDetails);
      console.log("Class info", await classService.getClassById(id));
      console.log(
        "teacher info",
        await userService.getUserById(classDetails.teacher)
      );
      setTeacher(await userService.getUserById(classDetails.teacher));
    } catch (err) {
      console.log(err);
    }
  };

  if (!classInfo || !user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="rounded-xl bg-blue-600">
        <div className="p-8 text-white">
          <h1 className="text-3xl font-semibold truncate">{classInfo.name}</h1>
          <p className="text-lg mt-1 opacity-95">
            GV: {teacher?.full_name} –{" "}
            {classInfo.schedule
              ?.map((s) => `Thứ ${s.dayOfWeek}, Ca ${s.shift}`)
              .join("; ")}{" "}
            – phòng {classInfo.room}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[20%_80%] gap-6 p-4">
        <div className="">
          <div className="bg-white border rounded-xl border-gray-500 px-4 shadow-sm  gap-4 w-full sm:w-auto">
            <div className="font-medium w-full flex items-center gap-4 my-4">
              <BsCameraVideo /> Phòng học Online
            </div>
            <button
              onClick={() => navigate(`/meet-room/${id}`)}
              className="w-full mt-1 px-5 py-1.5 mb-4 border border-gray-500 rounded-full hover:bg-gray-300 transition"
            >
              Vào phòng
            </button>
          </div>
          <ChatWithTeacher TEACHER_ID={teacher?._id} />
        </div>

        <div className="mt-6">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 hover:bg-blue-900 px-4 py-2 rounded-full text-white transition"
          >
            Tạo thảo luận
          </button>
          {notifications.length > 0 || posts.length > 0 ? (
            <>
              <div className="mb-3">
                {notifications.map((a) => (
                  <NotificationItem data={a} />
                ))}
              </div>

              <div className="mt-6">
                {posts.map((post) => (
                  <PostItem key={post._id} post={post} user={user} />
                ))}
              </div>
            </>
          ) : (
            <div className="mt-6 border rounded-xl p-6 shadow-sm bg-white">
              <p className="text-xl font-semibold">
                Bạn có thể trao đổi thông tin với mọi người tại đây.
              </p>
              <p className="text-gray-600 mt-1">
                Hiện tại chưa có thông báo nào
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
