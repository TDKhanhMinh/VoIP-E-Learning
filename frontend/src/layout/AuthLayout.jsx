import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LoadingProvider } from "../context/LoadingContext";
import LoaderOverlay from './../components/UI/LoaderOverlay';

export default function AuthLayout() {
    return (
        <LoadingProvider>
            <div className="min-h-screen bg-gray-100">
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
                <LoaderOverlay />
                <Outlet />
            </div>
        </LoadingProvider>
    );
}
