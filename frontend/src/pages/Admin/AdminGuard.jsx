import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const AdminGuard = () => {
    const { user, isLoading, isLoggedIn } = useAuth();

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    if (!isLoggedIn) {
        toast.info("Vui lòng đăng nhập")
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/404" replace />;
    }

    return <Outlet />;
};

export default AdminGuard;