# PRD — Product Requirements Document
# Cafe Manager

---

## 1. Tổng quan

Ứng dụng quản lý quán cafe với 2 giao diện:
- **Customer-facing**: khách quét QR → xem menu → đặt order (không cần login)
- **Admin/Staff**: đăng nhập → quản lý menu, order, bàn, doanh thu

---

## 2. Authentication

### 2.1 Admin / Staff Login
- Đăng nhập bằng Email + Password qua Firebase Auth
- Sau khi login, đọc document `users/{uid}` để lấy role (`admin` | `staff`)
- Redirect: admin → `/admin/dashboard`, staff → `/admin/dashboard`
- Không có trang đăng ký public — admin tạo tài khoản staff trong dashboard

### 2.2 Customer
- Không cần login
- Truy cập qua URL: `/menu/[tableId]`
- `tableId` được mã hóa trong QR code

---

## 3. Quản lý Menu (Admin)

### 3.1 Danh sách món
- Hiển thị tất cả món theo category
- Mỗi món có: tên, mô tả, giá, ảnh, category, trạng thái (available/unavailable)
- Filter theo category, search theo tên

### 3.2 Thêm / Sửa món
- Form: tên*, giá*, category*, mô tả, ảnh (upload lên Firebase Storage), trạng thái
- Validate: tên không trống, giá > 0, category bắt buộc

### 3.3 Xóa món
- Soft delete: set `isDeleted: true`, không xóa khỏi Firestore
- Món đã có trong order cũ vẫn hiển thị đúng

### 3.4 Category
- CRUD category (tên, thứ tự hiển thị)
- Mặc định: Cà phê, Trà, Nước ép, Bánh, Khác

---

## 4. QR Code & Quản lý Bàn (Admin)

### 4.1 Danh sách bàn
- Mỗi bàn có: số bàn, tên/mô tả, trạng thái (available/occupied), QR code

### 4.2 Tạo bàn
- Admin nhập số bàn → hệ thống tự sinh `tableId` (UUID)
- Tự động generate QR code chứa URL: `{domain}/menu/{tableId}`

### 4.3 Xuất QR
- Download QR dạng PNG cho từng bàn
- In QR để đặt trên bàn

---

## 5. Trang Menu (Customer)

### 5.1 Truy cập
- URL: `/menu/[tableId]`
- Validate `tableId` tồn tại trong Firestore, nếu không → hiển thị trang lỗi

### 5.2 Hiển thị
- Danh sách món theo category (tabs hoặc scroll)
- Mỗi món: ảnh, tên, giá, mô tả ngắn, nút thêm vào giỏ
- Chỉ hiển thị món có `isAvailable: true` và `isDeleted: false`

### 5.3 Giỏ hàng
- Floating cart button hiển thị số lượng
- Tăng/giảm số lượng, xóa món
- Hiển thị tổng tiền

### 5.4 Đặt order
- Khách nhập tên (optional) + ghi chú (optional)
- Nhấn "Đặt món" → tạo document trong `orders/`
- Hiển thị màn hình xác nhận + order ID
- Khách có thể xem trạng thái order theo `orderId`

---

## 6. Order Realtime (Admin / Staff)

### 6.1 Dashboard order
- Hiển thị tất cả order đang active, realtime (onSnapshot)
- Nhóm theo trạng thái: `pending` → `preparing` → `ready` → `completed`
- Mỗi order card: số bàn, danh sách món, tổng tiền, thời gian, trạng thái

### 6.2 Cập nhật trạng thái
- Drag & drop hoặc nút bấm để chuyển trạng thái
- Tự động cập nhật Firestore → customer thấy realtime

### 6.3 Filter
- Filter theo bàn, theo trạng thái, theo ngày

---

## 7. Thống kê Doanh thu (Admin)

### 7.1 Overview
- Tổng doanh thu hôm nay / tuần này / tháng này
- Số order hôm nay
- Món bán chạy nhất

### 7.2 Biểu đồ
- Doanh thu theo ngày (line chart, 30 ngày gần nhất)
- Top 5 món bán chạy (bar chart)

### 7.3 Lịch sử order
- Bảng tất cả order đã completed
- Filter theo ngày, export CSV (nice to have)

---

## 8. Firebase Schema

### Collection: `users`
```
users/{uid}
  - email: string
  - name: string
  - role: "admin" | "staff"
  - createdAt: Timestamp
```

### Collection: `categories`
```
categories/{categoryId}
  - name: string
  - order: number
  - createdAt: Timestamp
```

### Collection: `menuItems`
```
menuItems/{itemId}
  - name: string
  - description: string
  - price: number
  - imageUrl: string
  - categoryId: string
  - isAvailable: boolean
  - isDeleted: boolean
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

### Collection: `tables`
```
tables/{tableId}
  - tableNumber: number
  - name: string
  - status: "available" | "occupied"
  - qrCodeUrl: string
  - createdAt: Timestamp
```

### Collection: `orders`
```
orders/{orderId}
  - tableId: string
  - tableNumber: number
  - customerName: string (optional)
  - note: string (optional)
  - status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  - items: [
      {
        itemId: string,
        name: string,
        price: number,
        quantity: number
      }
    ]
  - totalAmount: number
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

---

## 9. Non-functional Requirements

- Responsive: mobile-first (customer dùng điện thoại là chính)
- Realtime latency < 2s
- Ảnh món ăn: nén trước khi upload, max 500KB
- Không cần i18n — chỉ tiếng Việt
