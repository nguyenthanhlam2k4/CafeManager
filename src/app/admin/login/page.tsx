import { Suspense } from "react";
import LoginPageContent from "@/components/admin/LoginPageContent";

function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Đang tải...</p>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

export default AdminLoginPage;
