import { Outlet, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { ToastContainer } from "react-toastify";
import { SIDEBAR_DATA } from "../assets/sidebar-data";
import Navbar from "../components/NavBar";
import { MdLogout } from "react-icons/md";
import { authService } from "../services/authService";
function MainLayout() {
    const navigate = useNavigate();

    const handlerLogout = async () => {
        await authService.logout();
        navigate("/", { state: { isLogin: false } });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="grid grid-cols-12 flex-1">
                <aside className="col-span-2 bg-white rounded-xl shadow-2xl">
                    <div className="bg-blue-500 h-14 flex items-center justify-center">
                        <div className="uppercase text-white flex justify-center items-center space-x-2">
                            <img className="w-7 h-7 rounded-full" src="https://www.senviet.art/wp-content/uploads/edd/2021/12/dai-hoc-tdt.jpg" />
                            <span>E-Learning VoIP Tools</span>
                        </div>
                    </div>
                    <ul className="container border-b">
                        {
                            SIDEBAR_DATA.map((item, index) => (
                                <li key={index} className="flex items-center  my-2 ">
                                    <Button className="w-full rounded font-normal flex items-center mx-1 hover:bg-gray-200 " title={item.title} to={item.to} icon={item.icon}></Button>
                                </li>
                            ))
                        }
                    </ul>
                    <Button onClick={handlerLogout}
                        className="flex justify-start hover:bg-gray-200 container mt-2">
                        <div className="flex items-center justify-center space-x-4">
                            <MdLogout />
                            <span>Thoát</span>
                        </div>
                    </Button>
                </aside>
                <section className="col-span-10 bg-gray-50 border rounded-xl">
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        closeOnClick
                        pauseOnHover
                        draggable
                        theme="colored"
                    />
                    <Navbar />
                    <Outlet />
                </section>
            </div>

        </div>

    );
}

export default MainLayout;