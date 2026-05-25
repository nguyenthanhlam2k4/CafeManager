# ARCHITECTURE — Cafe Manager

---

## 1. Tổng quan hệ thống

```
┌─────────────────────────────────────────────────┐
│                  Next.js 14                      │
│                                                  │
│  ┌──────────────┐      ┌──────────────────────┐  │
│  │   Customer   │      │     Admin / Staff    │  │
│  │  (no auth)   │      │   (Firebase Auth)    │  │
│  └──────┬───────┘      └──────────┬───────────┘  │
│         │                         │              │
└─────────┼─────────────────────────┼──────────────┘
          │                         │
          ▼                         ▼
┌─────────────────────────────────────────────────┐
│                   Firebase                       │
│                                                  │
│  ┌────────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Firestore  │  │   Auth   │  │   Storage   │  │
│  │  (data)    │  │ (admin)  │  │  (images)   │  │
│  └────────────┘  └──────────┘  └─────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 2. Route Structure

```
app/
├── (customer)/
│   ├── menu/[tableId]/
│   │   └── page.tsx          # Trang menu cho khách
│   └── order/[orderId]/
│       └── page.tsx          # Xem trạng thái order
│
├── (admin)/
│   ├── login/
│   │   └── page.tsx          # Trang đăng nhập
│   ├── dashboard/
│   │   └── page.tsx          # Order realtime
│   ├── menu/
│   │   └── page.tsx          # Quản lý món ăn
│   ├── tables/
│   │   └── page.tsx          # Quản lý bàn + QR
│   └── revenue/
│       └── page.tsx          # Thống kê doanh thu
│
└── layout.tsx
```

---

## 3. Data Flow

### 3.1 Customer đặt order

```
Customer quét QR
  → /menu/[tableId]
  → validate tableId (Firestore read: tables/{tableId})
  → fetch menuItems (where isDeleted=false, isAvailable=true)
  → Customer chọn món → Zustand cart store
  → Submit order
  → Firestore write: orders/{newOrderId}
  → Redirect: /order/{orderId}
  → onSnapshot orders/{orderId} → cập nhật trạng thái realtime
```

### 3.2 Admin xem order realtime

```
Admin login (Firebase Auth)
  → đọc users/{uid} → lấy role
  → /admin/dashboard
  → onSnapshot: orders (where status != "completed", orderBy createdAt)
  → Hiển thị realtime, tự update khi có order mới
  → Admin click cập nhật trạng thái
  → Firestore update: orders/{orderId}.status
  → Customer page tự cập nhật qua onSnapshot
```

### 3.3 Upload ảnh món ăn

```
Admin chọn file ảnh
  → Compress ảnh (browser-image-compression)
  → Upload lên Firebase Storage: menuItems/{itemId}/image.jpg
  → Lấy downloadURL
  → Lưu vào Firestore: menuItems/{itemId}.imageUrl
```

---

## 4. Realtime Strategy

Dùng **Firestore onSnapshot** cho:
- Order dashboard (admin) — lắng nghe collection `orders`
- Trạng thái order (customer) — lắng nghe document `orders/{orderId}`

```typescript
// Pattern chuẩn cho realtime hook
const unsubscribe = onSnapshot(
  query(collection(db, 'orders'), where('status', '!=', 'completed')),
  (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setOrders(orders)
  }
)

// Cleanup trong useEffect
return () => unsubscribe()
```

---

## 5. Role & Permission

| Action | Customer | Staff | Admin |
|---|---|---|---|
| Xem menu | ✅ | ✅ | ✅ |
| Đặt order | ✅ | ❌ | ✅ |
| Xem order dashboard | ❌ | ✅ | ✅ |
| Cập nhật trạng thái order | ❌ | ✅ | ✅ |
| CRUD menu | ❌ | ❌ | ✅ |
| Quản lý bàn / QR | ❌ | ❌ | ✅ |
| Xem doanh thu | ❌ | ❌ | ✅ |
| Tạo tài khoản staff | ❌ | ❌ | ✅ |

### Firebase Security Rules (tóm tắt)

```
- orders: read/write nếu chưa có auth (customer tạo order)
           read/write nếu có auth (staff/admin cập nhật)
- menuItems: read = public, write = admin only
- tables: read = public, write = admin only
- users: read/write = chỉ chính user đó hoặc admin
```

---

## 6. State Management

```
Zustand Stores:
├── useCartStore       # Giỏ hàng của customer (items, total, tableId)
├── useAuthStore       # User session (uid, role, name)
└── useOrderStore      # Active orders cho admin dashboard
```

---

## 7. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 8. Thư viện chính

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "typescript": "5.x",
    "tailwindcss": "3.x",
    "firebase": "10.x",
    "zustand": "4.x",
    "react-hook-form": "7.x",
    "zod": "3.x",
    "qrcode.react": "3.x",
    "date-fns": "3.x",
    "recharts": "2.x",
    "browser-image-compression": "2.x"
  }
}
```
