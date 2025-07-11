import PageMeta from '@/components/common/PageMeta';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useVideo } from "@/hooks/useVideo";
import { Edit2, Eye, Play, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IPlaylist } from "../../../types/video";

const DashboardPlaylistPage = () => {
  // Lấy các hook mới từ useVideo (sau khi đã cập nhật service & hook)
  const {
    useGetPlaylists,
    useCreatePlaylist,
    useDeletePlaylist,
  } = useVideo();

  // Lấy danh sách playlist
  const { data, isLoading } = useGetPlaylists();
  const playlists = data?.playlists || [];

  // Mutation tạo và xóa playlist
  const createPlaylist = useCreatePlaylist();
  const deletePlaylist = useDeletePlaylist();

  // State cho dialog tạo playlist
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // State cho dialog xác nhận xóa
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<any>(null);

  // Xử lý tạo playlist
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createPlaylist.mutate(
      { title: name, description, isPublic },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setDescription("");
          setIsPublic(true);
        }
      }
    );
  };

  // Xử lý mở dialog xác nhận xóa
  const handleDelete = (playlist: any) => {
    setPlaylistToDelete(playlist);
    setDeleteDialogOpen(true);
  };

  // Xác nhận xóa playlist
  const confirmDelete = () => {
    if (playlistToDelete) {
      deletePlaylist.mutate(playlistToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setPlaylistToDelete(null);
        }
      });
    }
  };

  return (
    <>
      <PageMeta
        title="Quản lý danh sách phát - DevTube"
        description="Tạo, chỉnh sửa và quản lý danh sách phát của kênh. Sắp xếp video vào các bộ sưu tập tùy chỉnh."
      />
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Quản lý Playlist của Channel</h1>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo Playlist mới
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-3 text-left font-medium">#</th>
                <th className="p-3 text-left font-medium">Thumbnail</th>
                <th className="p-3 text-left font-medium">Tên Playlist</th>
                <th className="p-3 text-left font-medium">Mô tả</th>
                <th className="p-3 text-left font-medium">Số video</th>
                <th className="p-3 text-left font-medium">Công khai</th>
                <th className="p-3 text-center font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7}>
                      <Skeleton className="h-16 w-full rounded-lg my-2" />
                    </td>
                  </tr>
                ))
                : playlists.length
                  ? playlists.map((playlist: IPlaylist, idx: number) => (
                    <tr key={playlist.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">
                        <img
                          src={playlist.thumbnailUrl || "https://cdn-icons-png.flaticon.com/512/1179/1179069.png"}
                          alt={playlist.title}
                          className="w-20 h-12 object-cover rounded border"
                        />
                      </td>
                      <td className="p-3 font-semibold">
                        <Link to={`/dashboard/playlists/${playlist.id}/edit`} className="hover:underline flex items-center gap-2">
                          <Play className="w-4 h-4 text-primary" />
                          {playlist.title}
                        </Link>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground line-clamp-2">{playlist.description}</td>
                      <td className="p-3 text-center">{playlist.videos?.length || 0}</td>
                      <td className="p-3">
                        {playlist.isPublic ? (
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Công khai</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">Riêng tư</span>
                        )}
                      </td>
                      <td className="p-3 flex gap-2 justify-center">
                        <Link to={`/playlist/${playlist.id}`}>
                          <Button size="icon" variant="outline" className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/dashboard/playlists/edit/${playlist.id}`}>
                          <Button size="icon" variant="outline">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                          onClick={() => handleDelete(playlist)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                  : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        Không có playlist nào.
                      </td>
                    </tr>
                  )
              }
            </tbody>
          </table>
        </div>

        {/* Dialog tạo playlist */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo Playlist mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <Input
                placeholder="Tên playlist"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <Input
                placeholder="Mô tả"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={e => setIsPublic(e.target.checked)}
                  id="isPublic"
                />
                <label htmlFor="isPublic" className="text-sm">Công khai</label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createPlaylist.isPending}>
                  Tạo
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog xác nhận xóa */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa playlist</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa playlist <b>{playlistToDelete?.title}</b> không? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deletePlaylist.isPending}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default DashboardPlaylistPage;