# DevHub 

DevHub à ứng dụng web React được xây dựng với TypeScript và Vite. Đây là giao diện người dùng cho nền tảng DevTube, cung cấp trải nghiệm hiện đại và responsive để quản lý và tương tác với nội dung video.

## 📋 Thống Kê Chức Năng

### 🔐 **Quản Lý Xác Thực (Authentication)**

- **Đăng nhập Google OAuth**: Đăng nhập bằng tài khoản Google
- **Đăng nhập tự động**: Tự động đăng nhập lại khi session Google còn hiệu lực
- **Quản lý phiên đăng nhập**: Lưu trữ token an toàn bằng HttpOnly Cookies
- **Làm mới token tự động**: Tự động gia hạn token khi hết hạn
- **Phân quyền theo vai trò**: Hỗ trợ vai trò User và Admin
- **Bảo vệ tuyến đường**: Bảo vệ các trang yêu cầu xác thực

### 🎥 **Quản Lý Video**

- **Xem video**: Phát video với HLS Video Player
- **Tải lên video**: Upload video với multipart upload lên S3
- **Chỉnh sửa video**: Cập nhật metadata video (tiêu đề, mô tả, thumbnail)
- **Xóa video**: Xóa video khỏi hệ thống
- **Xuất bản video**: Công khai video sau khi upload
- **Quản lý trạng thái video**: Theo dõi trạng thái xử lý video
- **Xem video của tôi**: Danh sách video đã upload
- **Tìm kiếm video**: Tìm kiếm video theo từ khóa
- **Lọc video**: Lọc theo danh mục, thời gian, sắp xếp

### 💬 **Hệ Thống Bình Luận**

- **Tạo bình luận**: Viết bình luận cho video
- **Xem bình luận**: Hiển thị danh sách bình luận
- **Hiển thị thông tin người dùng**: Avatar, tên, thời gian bình luận

### 👍 **Tương Tác Video**

- **Thích video**: Thích/bỏ thích video
- **Lưu video**: Lưu video vào danh sách yêu thích
- **Xem sau**: Thêm video vào danh sách xem sau
- **Đếm lượt thích**: Hiển thị số lượt thích video
- **Kiểm tra trạng thái**: Kiểm tra video đã thích/lưu/xem sau chưa

### 📚 **Quản Lý Playlist**

- **Tạo playlist**: Tạo danh sách phát mới
- **Chỉnh sửa playlist**: Cập nhật thông tin playlist
- **Xóa playlist**: Xóa playlist khỏi hệ thống
- **Thêm video vào playlist**: Thêm video vào playlist
- **Xem playlist**: Hiển thị danh sách video trong playlist
- **Quản lý playlist**: Danh sách tất cả playlist của user

### 📺 **Kênh và Người Dùng**

- **Xem kênh**: Hiển thị thông tin kênh người dùng
- **Video kênh**: Danh sách video của kênh
- **Playlist kênh**: Danh sách playlist của kênh
- **Đăng ký kênh**: Theo dõi/bỏ theo dõi kênh
- **Đếm người đăng ký**: Hiển thị số người đăng ký kênh

### 🏠 **Trang Chủ và Khám Phá**

- **Trang chủ**: Hiển thị video được đề xuất
- **Khám phá**: Tìm kiếm video theo danh mục
- **Video liên quan**: Hiển thị video tương tự
- **Video phổ biến**: Danh sách video được xem nhiều

### 📱 **Giao Diện Người Dùng**

- **Responsive Design**: Tương thích với mọi thiết bị
- **Dark/Light Mode**: Chuyển đổi giao diện sáng/tối
- **Loading States**: Hiển thị trạng thái tải
- **Error Handling**: Xử lý lỗi thân thiện
- **Toast Notifications**: Thông báo kết quả thao tác
- **Modal Dialogs**: Hộp thoại tương tác
- **Navigation**: Điều hướng dễ dàng

### 🔧 **Dashboard (Bảng Điều Khiển)**

- **Quản lý video**: Xem, chỉnh sửa, xóa video
- **Quản lý playlist**: Tạo, chỉnh sửa, xóa playlist
- **Hồ sơ cá nhân**: Cập nhật thông tin cá nhân
- **Upload video**: Giao diện upload video mới

### 👥 **Quản Trị (Admin)**

- **Quản lý người dùng**: Xem danh sách người dùng
- **Quản lý video**: Quản lý tất cả video trong hệ thống
- **Báo cáo**: Xem báo cáo hệ thống
- **Cài đặt**: Cấu hình hệ thống

### 📂 **Quản Lý Tệp**

- **Upload thumbnail**: Tải lên ảnh đại diện video
- **Drag & Drop**: Kéo thả file để upload
- **Progress tracking**: Theo dõi tiến trình upload
- **File validation**: Kiểm tra định dạng và kích thước file

### 🔗 **Chia Sẻ và Tương Tác**

- **Chia sẻ video**: Sao chép link video
- **Chia sẻ mạng xã hội**: Chia sẻ lên Facebook, Twitter, LinkedIn
- **Thêm vào playlist**: Thêm video vào playlist từ trang xem

## 🏗️ Cấu Trúc Dự Án

Dự án được tổ chức theo các thư mục chính sau:

- **`assets/`**: Chứa tài nguyên tĩnh như hình ảnh và biểu tượng

  - Ví dụ: `react.svg`

- **`components/`**: Chứa các component UI có thể tái sử dụng và component theo tính năng

  - Thư mục con bao gồm:
    - `auth/`: Component liên quan đến xác thực
    - `channel/`: Component quản lý kênh
    - `common/`: Component dùng chung trong ứng dụng
    - `guards/`: Bảo vệ tuyến đường cho trang được bảo vệ
    - `shared/`: Tiện ích hoặc component dùng chung
    - `ui/`: Component UI cụ thể
    - `video/`: Component cho tính năng video
    - `upload/`: Component upload file

- **`configs/`**: File cấu hình cho ứng dụng

  - Ví dụ: `apiEndpoints.ts` cho cấu hình API endpoints

- **`contexts/`**: Provider React context để quản lý state toàn cục

  - Ví dụ:
    - `AuthContext.tsx`: Context xác thực
    - `ThemeContext.tsx`: Context giao diện
    - `UIContext.tsx`: Context giao diện người dùng

- **`hooks/`**: Custom React hooks cho logic có thể tái sử dụng

  - Ví dụ:
    - `useAuth.ts`: Hook cho logic xác thực
    - `useBreakpoint.ts`: Hook cho responsive breakpoints
    - `useTheme.ts`: Hook quản lý giao diện
    - `useVideo.ts`: Hook quản lý video
    - `useUpload.ts`: Hook upload file

- **`layouts/`**: Component layout để cấu trúc trang

  - Ví dụ:
    - `AdminLayout.tsx`: Layout cho trang admin
    - `ChannelLayout.tsx`: Layout cho trang kênh
    - `DashboardLayout.tsx`: Layout cho dashboard

- **`pages/`**: Chứa các trang riêng lẻ của ứng dụng

- **`providers/`**: Provider để bọc ứng dụng với cấu hình hoặc dịch vụ toàn cục

- **`routes/`**: Cấu hình routing ứng dụng

- **`services/`**: File dịch vụ cho API calls và business logic

- **`types/`**: Định nghĩa TypeScript types

- **`utils/`**: Hàm tiện ích và helpers

## 🚀 Tính Năng Chính

- **React + TypeScript**: Tận dụng sức mạnh của TypeScript cho type safety và React để xây dựng giao diện người dùng động
- **Vite**: Công cụ build nhanh cho ứng dụng web hiện đại với Hot Module Replacement (HMR)
- **ESLint Integration**: Được cấu hình với type-aware lint rules để cải thiện chất lượng code
- **Custom Hooks và Contexts**: Triển khai hooks và context providers có thể tái sử dụng để quản lý state và logic abstraction
- **Responsive Design**: Được xây dựng với responsive design, đảm bảo tương thích trên mọi thiết bị
- **Google OAuth**: Xác thực bằng Google OAuth với silent login
- **Video Streaming**: Hỗ trợ phát video HLS
- **File Upload**: Upload video và thumbnail với multipart upload
- **Real-time Updates**: Cập nhật real-time cho trạng thái video

## 🛠️ Thiết Lập Phát Triển

### Yêu Cầu

- Node.js (phiên bản LTS được khuyến nghị)
- npm hoặc yarn package manager

### Cài Đặt

1. Clone repository:

   ```bash
   git clone https://github.com/your-repo/devhub-fe.git
   cd devhub-fe
   ```

2. Cài đặt dependencies:

   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. Khởi động development server:
   ```bash
   npm run dev
   # hoặc
   yarn dev
   ```

### Linting và Formatting

Dự án sử dụng ESLint cho linting và Prettier cho format code. Để chạy kiểm tra lint:

```bash
npm run lint
# hoặc
yarn lint
```

## 📝 Mở Rộng Cấu Hình ESLint

Để bật type-aware lint rules, cập nhật cấu hình ESLint như sau:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

Ngoài ra, cài đặt và cấu hình React-specific plugins:

```js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## 🤝 Đóng Góp

Đóng góp rất được chào đón! Vui lòng tuân theo các hướng dẫn được nêu trong file `CONTRIBUTING.md`.

## 📄 Giấy Phép

Dự án này được cấp phép theo [MIT License](LICENSE).
