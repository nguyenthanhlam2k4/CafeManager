# ☕ Cafe Manager

Hệ thống quản lý quán cafe hiện đại — khách quét QR từng bàn để xem menu và đặt order, staff nhận order realtime, admin quản lý toàn bộ qua dashboard.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Backend / DB | Firebase (Firestore + Auth + Storage) |
| Realtime | Firestore onSnapshot |
| QR | qrcode.react (generate) + html5-qrcode (scan) |
| State | Zustand |
| Form | React Hook Form + Zod |

## Luồng hoạt động chính

```
Khách ngồi bàn
  → Quét QR (mã hóa tableId)
  → Xem menu
  → Chọn món → đặt order
  → Order lưu Firestore realtime
  → Staff / Admin thấy ngay trên dashboard
  → Cập nhật trạng thái order
  → Thống kê doanh thu tự động
```

## Roles

- **customer** — chỉ xem menu + đặt order (không cần login)
- **staff** — xem order realtime, cập nhật trạng thái
- **admin** — full quyền: menu, bàn, QR, thống kê, tài khoản
