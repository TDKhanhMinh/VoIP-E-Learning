import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptop, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { LuUserRoundCheck } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
export const SIDEBAR_DATA = [
  {
    title: "Trang chủ",
    icon: <IoHomeOutline />,
    to: "/home",
  },
  {
    title: "Thời khóa biểu",
    icon: <FontAwesomeIcon icon={faLaptop} />,
    to: "/home/schedule",
  },
  {
    title: "Bài tập",
    icon: <FontAwesomeIcon icon={faListCheck} />,
    to: "/course/home",
  },
  {
    title: "Thi online",
    icon: <FontAwesomeIcon icon={faLaptop} />,
    to: "/home/online-test",
  },

  {
    title: "Điểm danh",
    icon: <LuUserRoundCheck />,
    to: "/home/attendance",
  },
  {
    title: "Thông báo",
    icon: <IoMdNotificationsOutline />,
    to: "/home/notification",
  },
  {
    title: "Diễn đàn",
    icon: <FaRegComment />,
    to: "/home/forum",
  },
  {
    title: "Chat",
    icon: <IoChatbubblesOutline />,
    to: "/home/chat",
  },
];
