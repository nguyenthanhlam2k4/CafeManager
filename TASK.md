# TASK — Cafe Manager

> AI thực hiện từng task theo thứ tự. Mỗi task xong thì đánh dấu [x].
> Không được skip task, không được làm task sau khi task trước chưa xong.

---

## Phase 1 — Setup & Foundation

- [x] Khởi tạo project Next.js 14 + TypeScript + Tailwind CSS
- [x] Cài đặt toàn bộ dependencies theo ARCHITECTURE.md
- [x] Cấu hình tsconfig strict mode
- [x] Tạo folder structure theo PROJECT_RULES.md
- [x] Setup Firebase project + cấu hình `/src/lib/firebase/config.ts`
- [x] Tạo file `.env.local` và `.env.example`
- [x] Viết Firebase Security Rules cơ bản
- [x] Tạo tất cả TypeScript types trong `/src/types/`

---

## Phase 2 — Auth (Admin/Staff)

- [x] Tạo `useAuthStore` (Zustand) — lưu user session + role
- [x] Tạo hook `useAuth` — firebase auth listener
- [x] Tạo trang `/admin/login` — form email/password + validation Zod
- [x] Tạo middleware Next.js — bảo vệ route `/admin/*`
- [x] Tạo helper `createStaffAccount` cho admin tạo tài khoản staff

---

## Phase 3 — Quản lý Menu (Admin)

- [x] Tạo Firestore service: `menuService.ts` (CRUD menuItems + categories)
- [x] Tạo hook `useMenuItems` — fetch + realtime
- [x] Tạo trang `/admin/menu` — danh sách món, filter, search
- [x] Tạo component `MenuItemForm` — thêm/sửa món (React Hook Form + Zod)
- [x] Tích hợp upload ảnh lên Firebase Storage (có compress)
- [x] Tạo component `CategoryManager` — CRUD category

---

## Phase 4 — Quản lý Bàn & QR

- [x] Tạo Firestore service: `tableService.ts` (CRUD tables)
- [x] Tạo trang `/admin/tables` — danh sách bàn
- [x] Tạo component `TableCard` — hiển thị bàn + trạng thái
- [x] Generate QR code cho từng bàn (`qrcode.react`)
- [x] Tính năng download QR dạng PNG

---

## Phase 5 — Customer Menu Page

- [x] Tạo trang `/menu/[tableId]` — validate tableId, fetch menu
- [x] Tạo component `MenuCategory` — tabs/scroll theo category
- [x] Tạo component `MenuItem` — ảnh, tên, giá, nút thêm giỏ
- [x] Tạo `useCartStore` (Zustand) — quản lý giỏ hàng
- [x] Tạo component `CartDrawer` — xem giỏ, tăng/giảm số lượng
- [x] Tạo form đặt order — tên khách, ghi chú, confirm
- [x] Xử lý submit order — write Firestore `orders/`

---

## Phase 6 — Order Realtime

- [x] Tạo Firestore service: `orderService.ts`
- [x] Tạo hook `useOrders` — onSnapshot active orders
- [x] Tạo trang `/admin/dashboard` — kanban/list order realtime
- [x] Tạo component `OrderCard` — thông tin order + nút cập nhật status
- [x] Xử lý cập nhật trạng thái order
- [x] Tạo trang `/order/[orderId]` — customer xem trạng thái realtime

---

## Phase 7 — Thống kê Doanh thu

- [x] Tạo query Firestore — aggregate orders theo ngày/tuần/tháng
- [x] Tạo trang `/admin/revenue` — overview cards
- [x] Tạo biểu đồ doanh thu theo ngày (Recharts LineChart)
- [x] Tạo biểu đồ top món bán chạy (Recharts BarChart)
- [x] Tạo bảng lịch sử order completed

---

## Phase 8 — Polish & Deploy

- [x] Responsive check toàn bộ trang (mobile-first)
- [x] Loading states + error states cho mọi async action
- [x] Toast notifications (thêm giỏ hàng, đặt order thành công, lỗi...)
- [x] Empty states cho danh sách trống
- [x] Tối ưu performance: lazy load ảnh, pagination order history
- [x] Deploy lên Vercel
- [x] Setup Firebase Security Rules production

---

## Ghi chú

- Mỗi lần bắt đầu session mới, đọc file này để biết đang ở task nào
- Sau khi hoàn thành task, cập nhật `[x]` trước khi chuyển task tiếp theo
- Nếu phát sinh task mới, thêm vào phase phù hợp
