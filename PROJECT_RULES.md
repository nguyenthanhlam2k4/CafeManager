# PROJECT RULES — Cafe Manager

> File này là luật. AI không được tự ý thay đổi bất kỳ quy tắc nào dưới đây.

---

## Framework & Runtime

- Next.js 14, App Router (`/app` directory), KHÔNG dùng Pages Router
- TypeScript strict mode — `"strict": true` trong tsconfig
- Node.js 18+

## Styling

- **Tailwind CSS only** — không dùng CSS Modules, styled-components, hay inline style
- Không import thư viện UI bên ngoài (MUI, Chakra, Ant Design...) trừ khi được ghi rõ trong PRD
- Component shadcn/ui được phép dùng nếu cần, install từng cái, không install cả bộ
- Dark mode: chưa cần, bỏ qua

## TypeScript

- Tất cả props, state, data đều phải có type — không dùng `any`
- Interface cho object data, type cho union/primitive
- Đặt types trong `/src/types/` — mỗi domain một file (order.ts, menu.ts, table.ts...)

## Naming Convention

| Thứ | Convention | Ví dụ |
|---|---|---|
| Component | PascalCase | `OrderCard.tsx` |
| Hook | camelCase + use | `useOrders.ts` |
| Util function | camelCase | `formatPrice.ts` |
| Constant | UPPER_SNAKE | `MAX_TABLE_COUNT` |
| Firebase collection | camelCase | `orders`, `menuItems` |
| CSS class | Tailwind only | — |

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (customer)/         # Route group: khách hàng
│   │   ├── menu/[tableId]/ # Trang menu theo bàn
│   │   └── order/          # Trang đặt order
│   ├── (admin)/            # Route group: admin/staff
│   │   ├── dashboard/
│   │   ├── menu/
│   │   ├── tables/
│   │   └── revenue/
│   ├── api/                # API routes nếu cần
│   └── layout.tsx
├── components/
│   ├── ui/                 # shadcn/ui hoặc base components
│   ├── customer/           # Component cho phía khách
│   └── admin/              # Component cho phía admin
├── hooks/                  # Custom hooks
├── lib/
│   ├── firebase/           # Config + helpers firebase
│   └── utils/              # Utility functions
├── stores/                 # Zustand stores
├── types/                  # TypeScript types/interfaces
└── constants/              # Hằng số toàn project
```

## Firebase

- Dùng **Firebase v9 modular SDK** — không dùng compat API
- Tất cả firebase logic nằm trong `/src/lib/firebase/`
- Không gọi firebase trực tiếp trong component — phải qua hook hoặc service
- Security Rules phải được viết, không để rules mở

## State Management

- **Zustand** cho global state (cart, user session, realtime orders)
- `useState` cho local UI state
- Không dùng Redux, Context API cho global state

## Form & Validation

- **React Hook Form** + **Zod** cho mọi form
- Schema Zod đặt trong `/src/types/` cùng với interface

## Cấm tuyệt đối

- ❌ Không dùng `axios` — chỉ dùng `fetch` hoặc Firebase SDK
- ❌ Không dùng `moment.js` — dùng `date-fns`
- ❌ Không dùng `class component`
- ❌ Không đặt logic business trong JSX/TSX — tách ra hook hoặc util
- ❌ Không hardcode string tiếng Việt trong component — đặt vào constants
- ❌ Không commit file `.env` — chỉ commit `.env.example`
- ❌ Không tạo file ngoài thư mục `src/`

## Code Style

- Dùng `function` declaration cho component, không dùng `const Component = () =>`
- Export default ở cuối file
- Mỗi file chỉ export 1 component chính
- Không comment code thừa, không để `console.log` khi commit
