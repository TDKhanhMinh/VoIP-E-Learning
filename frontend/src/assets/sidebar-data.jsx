import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptop, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { LuUserRoundCheck } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
export const SIDEBAR_DATA = [
  {
    title: "Trang chủ",
    icon: <IoHomeOutline />,
    to: "/home",
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
];
