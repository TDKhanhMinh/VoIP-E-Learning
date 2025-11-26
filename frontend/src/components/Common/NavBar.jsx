import { Link } from "react-router-dom";
import DropDownButton from "./DropdownButton";
import { MdOutlineMarkChatUnread } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
export default function Navbar() {
    const semester = [{
        title: "HK1 2223"
    },
    {
        title: "HK2 2223"
    },
    {
        title: "HK1 2324"
    },
    {
        title: "HK2 2324"
    }];
    return (
        <div className="p-2 bg-blue-500 text-white flex gap-4 flex justify-end">
            <div className="flex items-center space-x-4">
                <DropDownButton items={semester} className={"text-white cursor-pointer"}>
                    {"HK1 2526"}
                </DropDownButton>
                <DropDownButton>
                    <MdOutlineMarkChatUnread size={28} />
                </DropDownButton>
                <DropDownButton>
                    <IoMdNotificationsOutline size={28} />
                </DropDownButton>
                <DropDownButton className={""}>
                    <img className="w-10 h-10 rounded-full" src="https://tse1.mm.bing.net/th/id/OIP.0BY-L7BBiFB2zzjt92QeTwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3" />
                </DropDownButton>
            </div>
        </div>
    );
}
