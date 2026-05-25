export const AUTH_TOKEN_COOKIE = "auth-token";

export const AUTH_LABELS = {
  LOGIN_TITLE: "Đăng nhập",
  LOGIN_SUBTITLE: "Dành cho admin và nhân viên",
  EMAIL: "Email",
  PASSWORD: "Mật khẩu",
  SUBMIT: "Đăng nhập",
  SUBMITTING: "Đang đăng nhập...",
  LOADING: "Đang tải...",
  LOGOUT: "Đăng xuất",
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng",
  USER_NOT_FOUND:
    "Không tìm thấy profile trong Firestore. Copy UID từ Authentication → tạo document users/{UID} (phải trùng 100%, chú ý chữ l và I).",
  USER_NOT_FOUND_UID: (uid: string) =>
    `UID cần dùng cho document Firestore: ${uid}`,
  UNAUTHORIZED_ROLE: "Tài khoản không có quyền truy cập",
  GENERIC: "Đã xảy ra lỗi, vui lòng thử lại",
  CREATE_STAFF_FAILED: "Không thể tạo tài khoản nhân viên",
  CREATE_STAFF_UNAUTHORIZED: "Chỉ admin mới được tạo tài khoản",
} as const;

export const AUTH_ROUTES = {
  LOGIN: "/admin/login",
  DASHBOARD: "/admin/dashboard",
  MENU: "/admin/menu",
} as const;
