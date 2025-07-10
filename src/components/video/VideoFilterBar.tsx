import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';

interface VideoFilterBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeFilters: {
        visibility: { public: boolean; private: boolean; unlisted: boolean };
        status: { published: boolean; processing: boolean; draft: boolean };
    };
    toggleFilter: (type: 'visibility' | 'status', value: string) => void;
    areAnyFiltersActive: () => boolean;
    clearAllFilters: () => void;
    sortOption: string;
    setSortOption: (option: string) => void;
}

const VideoFilterBar = ({
    searchQuery,
    setSearchQuery,
    activeFilters,
    toggleFilter,
    areAnyFiltersActive,
    clearAllFilters,
    sortOption,
    setSortOption,
}: VideoFilterBarProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Tìm kiếm video của bạn..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full md:w-auto">
                            <Filter className="h-4 w-4 mr-2" />
                            <span>Lọc</span>
                            {areAnyFiltersActive() && (
                                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                    {Object.values(activeFilters.visibility).filter(Boolean).length +
                                        Object.values(activeFilters.status).filter(Boolean).length}
                                </span>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="p-2">
                            <h4 className="font-medium text-sm mb-1.5">Hiển thị</h4>
                            <div className="space-y-1">
                                <DropdownMenuCheckboxItem
                                    checked={activeFilters.visibility.public}
                                    onCheckedChange={() => toggleFilter('visibility', 'public')}
                                >
                                    Công khai
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={activeFilters.visibility.private}
                                    onCheckedChange={() => toggleFilter('visibility', 'private')}
                                >
                                    Riêng tư
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={activeFilters.visibility.unlisted}
                                    onCheckedChange={() => toggleFilter('visibility', 'unlisted')}
                                >
                                    Không công khai
                                </DropdownMenuCheckboxItem>
                            </div>
                        </div>

                        <DropdownMenuSeparator />

                        <div className="p-2">
                            <h4 className="font-medium text-sm mb-1.5">Trạng thái</h4>
                            <div className="space-y-1">
                                <DropdownMenuCheckboxItem
                                    checked={activeFilters.status.published}
                                    onCheckedChange={() => toggleFilter('status', 'published')}
                                >
                                    Đã xuất bản
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={activeFilters.status.processing}
                                    onCheckedChange={() => toggleFilter('status', 'processing')}
                                >
                                    Đang xử lý
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={activeFilters.status.draft}
                                    onCheckedChange={() => toggleFilter('status', 'draft')}
                                >
                                    Nháp
                                </DropdownMenuCheckboxItem>
                            </div>
                        </div>

                        <DropdownMenuSeparator />

                        <div className="p-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-center text-xs"
                                onClick={clearAllFilters}
                                disabled={!areAnyFiltersActive()}
                            >
                                Xóa lọc
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full md:w-auto">
                            <span>
                                Sắp xếp:{' '}
                                {sortOption === 'recent'
                                    ? 'Mới nhất'
                                    : sortOption === 'oldest'
                                        ? 'Cũ nhất'
                                        : sortOption === 'views'
                                            ? 'Xem nhiều nhất'
                                            : 'Tên'}
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSortOption('recent')}>Most recent</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOption('oldest')}>Oldest</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOption('views')}>Most viewed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOption('alpha')}>Alphabetical</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default VideoFilterBar;