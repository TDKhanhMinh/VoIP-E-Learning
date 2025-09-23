import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptop,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { LuUserRoundCheck } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
export const SIDEBAR_DATA = [
  {
    title: "Trang chủ",
    icon:<IoHomeOutline />, 
    to: "/home"
  },
  {
    title: "Bài tập",
    icon: <FontAwesomeIcon icon={faListCheck} />,
    to: "/course/home"
  },
  {
    title: "Thi online",
    icon: <FontAwesomeIcon icon={faLaptop} />, 
    to: "/user/help-center"
  },
  {
    title: "Điểm danh",
    icon: <LuUserRoundCheck />,
    to: "/user/change-password"
  },
  {
    title: "Thông báo",
    icon: <IoMdNotificationsOutline /> ,
    to: "/user/change-password"
  },

];
