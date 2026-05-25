export { default as firebaseApp, auth, db, storage } from "./config";
export {
  signInWithEmail,
  signOutUser,
  fetchUserProfile,
  resolveAuthUser,
} from "./authService";
export { setSessionCookie, clearSessionCookie } from "./session";
export { createStaffAccount } from "./createStaffAccount";
export {
  getCategories,
  subscribeCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  seedDefaultCategories,
  getMenuItems,
  subscribeMenuItems,
  createMenuItem,
  updateMenuItem,
  softDeleteMenuItem,
  uploadMenuItemImage,
} from "./menuService";
