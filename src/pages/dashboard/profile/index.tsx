import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/useUser';
import axios from 'axios';
import { Camera, CheckCircle, Info, Mail, User } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

const UserProfile = () => {
    const { useGetUserProfile, useUpdateUserProfile, useCreateAvatarPresignedUrl } = useUser();
    const { data: user, isLoading } = useGetUserProfile();
    const updateUserProfile = useUpdateUserProfile();
    const createAvatarPresignedUrl = useCreateAvatarPresignedUrl();

    const [displayName, setDisplayName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync state when user data loaded
    React.useEffect(() => {
        if (user?.data) {
            setDisplayName(user.data.displayName || '');
            setAvatarUrl(user.data.avatarUrl || '');
            setDescription(user.data.description || '');
        }
    }, [user]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        setAvatarPreview(URL.createObjectURL(file));
        try {
            // 1. Lấy presigned url từ backend
            const { data: presigned } = await createAvatarPresignedUrl.mutateAsync({
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
            });
            // 2. Upload file lên S3 qua presigned url
            await axios.put(presigned.presignedUrl, file, {
                headers: { 'Content-Type': file.type }
            });
            // 3. Lấy public url từ backend trả về
            setAvatarUrl(presigned.key);
            setIsEditing(true);
            toast.success('Tải ảnh đại diện thành công!');
        } catch (err) {
            toast.error('Tải ảnh đại diện thất bại!');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        updateUserProfile.mutate(
            { displayName, avatarUrl, description },
            {
                onSuccess: () => {
                    toast.success('Cập nhật thông tin thành công!');
                    setIsEditing(false);
                },
                onError: () => {
                    toast.error('Cập nhật thất bại.');
                },
            }
        );
    };

    if (isLoading) {
        return <div className="p-8 text-center">Đang tải thông tin...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-8">
            {/* Cover Banner */}
            <div className="relative h-56 md:h-72 rounded-t-2xl overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg">
                <img
                    src={DEFAULT_COVER}
                    alt="cover"
                    className="w-full h-full object-cover object-center opacity-80"
                />
                {/* Avatar nổi */}
                <div className="absolute left-1/2 bottom-1/8 -bottom-16 transform -translate-x-1/2 z-10">
                    <div className="relative">
                        <Avatar className="w-32 h-32 border-4 border-white dark:border-neutral-900 shadow-xl bg-white dark:bg-neutral-900">
                            <AvatarImage src={avatarPreview || avatarUrl} />
                            <AvatarFallback>{displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            disabled={isUploading}
                        />
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute bottom-2 right-2 rounded-full shadow bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 hover:bg-blue-100 dark:hover:bg-neutral-800"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                            ) : (
                                <Camera className="w-5 h-5 text-blue-600" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Card thông tin */}
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-b-2xl shadow-lg pt-28 pb-10 px-6 md:px-12 -mt-12 flex flex-col items-center">
                {/* Tên, email, badge xác thực */}
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{displayName}</span>
                        {user?.data?.isVerified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 ml-1">
                                <CheckCircle className="w-4 h-4 mr-1 text-blue-500" /> Đã xác thực
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-300">
                        <Mail className="w-4 h-4 mr-1" />
                        <span className="text-base">{user?.data?.email}</span>
                    </div>
                </div>

                {/* Form chỉnh sửa */}
                <div className="w-full max-w-md space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Tên hiển thị</label>
                        <div className="relative">
                            <Input
                                value={displayName}
                                onChange={e => {
                                    setDisplayName(e.target.value);
                                    setIsEditing(true);
                                }}
                                maxLength={50}
                                className="rounded-lg px-4 py-2 text-base pl-10 focus:ring-2 focus:ring-blue-400"
                                placeholder="Tên hiển thị của bạn"
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Mô tả</label>
                        <div className="relative">
                            <Textarea
                                value={description}
                                onChange={e => {
                                    setDescription(e.target.value);
                                    setIsEditing(true);
                                }}
                                rows={4}
                                maxLength={200}
                                className="rounded-lg px-4 py-2 text-base pl-10 focus:ring-2 focus:ring-blue-400"
                                placeholder="Giới thiệu ngắn về bạn..."
                            />
                            <Info className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                <button
                    className="mt-8 w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={updateUserProfile.isPending || !isEditing || isUploading}
                >
                    {updateUserProfile.isPending ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                            Đang lưu...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Lưu thay đổi
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UserProfile;