import Loader from "@/components/ui/loader";
import { useAuth } from "@/contexts";
import { Navigate, useLocation } from "react-router";
import { ROUTES } from "../../constants/routes";

export const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
    const location = useLocation();
    const {
        user,
        isAuthenticated,
        isCheckingSession,
        isLoadingUser
    } = useAuth();

    // Kết hợp các trạng thái loading
    const isLoading = isCheckingSession || isLoadingUser;

    // Hiển thị trạng thái loading khi đang kiểm tra phiên hoặc đang tải user
    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center">
            <Loader message={'Verifying your session...'} />
        </div>;
    }

    // Kiểm tra xác thực sau khi đã tải xong
    if (!isAuthenticated) {
        console.log("User is not authenticated, redirecting to login");
        return <Navigate state={{ from: location }} to={ROUTES.AUTH} replace />;
    }

    // Kiểm tra quyền
    if (role && user?.role !== role) {
        return <Navigate state={{ from: location }} to={ROUTES.HOME} replace />;
    }

    return <>{children}</>;
};