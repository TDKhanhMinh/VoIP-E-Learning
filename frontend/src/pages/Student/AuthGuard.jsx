import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const AuthGuard = () => {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return <div>Đang kiểm tra quyền...</div>;
    }

    if (!isLoggedIn) {
        toast.info("Vui lòng đăng nhập")
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AuthGuard;