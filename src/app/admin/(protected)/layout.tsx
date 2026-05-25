import AuthGuard from "@/components/admin/AuthGuard";

function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

export default AdminProtectedLayout;
