export const MENU_LABELS = {
  PAGE_TITLE: "Quản lý menu",
  ADD_ITEM: "Thêm món",
  EDIT_ITEM: "Sửa món",
  SEARCH_PLACEHOLDER: "Tìm theo tên món...",
  ALL_CATEGORIES: "Tất cả",
  NO_ITEMS: "Chưa có món nào",
  AVAILABLE: "Đang bán",
  UNAVAILABLE: "Tạm ngưng",
  SAVE: "Lưu",
  SAVING: "Đang lưu...",
  CANCEL: "Hủy",
  DELETE: "Xóa",
  DELETING: "Đang xóa...",
  IMAGE: "Ảnh món",
  IMAGE_HINT: "PNG, JPG tối đa 500KB sau khi nén",
  NAME: "Tên món",
  DESCRIPTION: "Mô tả",
  PRICE: "Giá (VNĐ)",
  CATEGORY: "Danh mục",
  STATUS: "Trạng thái",
  SELECT_CATEGORY: "Chọn danh mục",
  LOADING: "Đang tải...",
} as const;

export const CATEGORY_LABELS = {
  TITLE: "Danh mục",
  ADD: "Thêm danh mục",
  EDIT: "Sửa",
  NAME: "Tên danh mục",
  ORDER: "Thứ tự hiển thị",
  EMPTY: "Chưa có danh mục",
  SEEDING: "Đang tạo danh mục mặc định...",
  DELETE_CONFIRM: "Xóa danh mục này?",
} as const;

export const MENU_ERRORS = {
  GENERIC: "Đã xảy ra lỗi, vui lòng thử lại",
  UPLOAD_FAILED: "Upload ảnh thất bại",
  DELETE_FAILED: "Không thể xóa món",
  SAVE_FAILED: "Không thể lưu món",
  CATEGORY_SAVE_FAILED: "Không thể lưu danh mục",
  CATEGORY_DELETE_FAILED: "Không thể xóa danh mục",
} as const;

export const DEFAULT_CATEGORIES = [
  { name: "Cà phê", order: 0 },
  { name: "Trà", order: 1 },
  { name: "Nước ép", order: 2 },
  { name: "Bánh", order: 3 },
  { name: "Khác", order: 4 },
] as const;
