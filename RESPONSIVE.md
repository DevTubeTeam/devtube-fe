# 📱 Responsive Strategy in React + TypeScript (Tailwind-based)

## 🎯 Mục tiêu
Xây dựng chiến lược responsive linh hoạt, mở rộng và hiệu quả cho frontend React app, bao gồm:

- ✅ Responsive layout (hiển thị thay đổi theo kích thước)
- ✅ Logic xử lý khác nhau theo device
- ✅ Tối ưu performance trên mobile
- ✅ Cấu trúc chuẩn hóa, dễ mở rộng, dễ test

---

## 🧱 Cấu trúc kỹ thuật

src/ ├── constants/ │ └── breakpoints.ts # Quản lý các breakpoint tập trung ├── hooks/ │ └── useBreakpoint.ts # Hook chính để detect breakpoint ├── hoc/ │ └── withResponsive.tsx # HOC để inject breakpoint vào component ├── components/ │ └── ResponsiveBox.tsx # Ví dụ responsive component

---

## 🛠 Công cụ sử dụng

| Tên | Vai trò |
|-----|---------|
| **Tailwind CSS** | Xử lý layout & class responsive |
| **`useBreakpoint()`** | Lấy breakpoint hiện tại (sm, md, lg...) |
| **`useIsMobile()`** | Trả về `true` nếu là mobile |
| **`useIsTablet()`** | Trả về `true` nếu là tablet |
| **`useIsDesktop()`** | Trả về `true` nếu là desktop |
| **`withResponsive()`** | Inject `breakpoint` vào bất kỳ component nào |

---

## 🧠 Chiến lược phân tầng responsive

| Tầng | Mục tiêu | Công cụ |
|------|----------|--------|
| 1. Layout | Responsive UI (CSS) | Tailwind |
| 2. Visibility | Ẩn/hiện component theo thiết bị | `useIsMobile()` |
| 3. Logic | Xử lý logic/feature khác nhau | `useBreakpoint()` |
| 4. Performance | Giảm tải cho mobile | Conditional render |
| 5. UX | Thay đổi flow người dùng | Conditional layout |

---


