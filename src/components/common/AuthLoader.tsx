import { Loader2 } from 'lucide-react';

export const AuthLoader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-gray-600">Đang kiểm tra trạng thái đăng nhập...</p>
            </div>
        </div>
    );
};
