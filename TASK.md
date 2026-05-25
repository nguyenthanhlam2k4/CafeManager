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

- [ ] Tạo `useAuthStore` (Zustand) — lưu user session + role
- [ ] Tạo hook `useAuth` — firebase auth listener
- [ ] Tạo trang `/admin/login` — form email/password + validation Zod
- [ ] Tạo middleware Next.js — bảo vệ route `/admin/*`
- [ ] Tạo helper `createStaffAccount` cho admin tạo tài khoản staff

---

## Phase 3 — Quản lý Menu (Admin)

- [ ] Tạo Firestore service: `menuService.ts` (CRUD menuItems + categories)
- [ ] Tạo hook `useMenuItems` — fetch + realtime
- [ ] Tạo trang `/admin/menu` — danh sách món, filter, search
- [ ] Tạo component `MenuItemForm` — thêm/sửa món (React Hook Form + Zod)
- [ ] Tích hợp upload ảnh lên Firebase Storage (có compress)
- [ ] Tạo component `CategoryManager` — CRUD category

---

## Phase 4 — Quản lý Bàn & QR

- [ ] Tạo Firestore service: `tableService.ts` (CRUD tables)
- [ ] Tạo trang `/admin/tables` — danh sách bàn
- [ ] Tạo component `TableCard` — hiển thị bàn + trạng thái
- [ ] Generate QR code cho từng bàn (`qrcode.react`)
- [ ] Tính năng download QR dạng PNG

---

## Phase 5 — Customer Menu Page

- [ ] Tạo trang `/menu/[tableId]` — validate tableId, fetch menu
- [ ] Tạo component `MenuCategory` — tabs/scroll theo category
- [ ] Tạo component `MenuItem` — ảnh, tên, giá, nút thêm giỏ
- [ ] Tạo `useCartStore` (Zustand) — quản lý giỏ hàng
- [ ] Tạo component `CartDrawer` — xem giỏ, tăng/giảm số lượng
- [ ] Tạo form đặt order — tên khách, ghi chú, confirm
- [ ] Xử lý submit order — write Firestore `orders/`

---

## Phase 6 — Order Realtime

- [ ] Tạo Firestore service: `orderService.ts`
- [ ] Tạo hook `useOrders` — onSnapshot active orders
- [ ] Tạo trang `/admin/dashboard` — kanban/list order realtime
- [ ] Tạo component `OrderCard` — thông tin order + nút cập nhật status
- [ ] Xử lý cập nhật trạng thái order
- [ ] Tạo trang `/order/[orderId]` — customer xem trạng thái realtime

---

## Phase 7 — Thống kê Doanh thu

- [ ] Tạo query Firestore — aggregate orders theo ngày/tuần/tháng
- [ ] Tạo trang `/admin/revenue` — overview cards
- [ ] Tạo biểu đồ doanh thu theo ngày (Recharts LineChart)
- [ ] Tạo biểu đồ top món bán chạy (Recharts BarChart)
- [ ] Tạo bảng lịch sử order completed

---

## Phase 8 — Polish & Deploy

- [ ] Responsive check toàn bộ trang (mobile-first)
- [ ] Loading states + error states cho mọi async action
- [ ] Toast notifications (thêm giỏ hàng, đặt order thành công, lỗi...)
- [ ] Empty states cho danh sách trống
- [ ] Tối ưu performance: lazy load ảnh, pagination order history
- [ ] Deploy lên Vercel
- [ ] Setup Firebase Security Rules production

---

## Ghi chú

- Mỗi lần bắt đầu session mới, đọc file này để biết đang ở task nào
- Sau khi hoàn thành task, cập nhật `[x]` trước khi chuyển task tiếp theo
- Nếu phát sinh task mới, thêm vào phase phù hợp
