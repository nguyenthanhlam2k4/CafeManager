import { auth } from "@/lib/firebase/config";
import { AUTH_ERRORS } from "@/constants/auth";
import type { CreateStaffFormValues } from "@/types/user";

interface CreateStaffResponse {
  uid: string;
}

interface CreateStaffErrorResponse {
  error: string;
}

export async function createStaffAccount(
  data: CreateStaffFormValues
): Promise<CreateStaffResponse> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("UNAUTHORIZED");
  }

  const idToken = await currentUser.getIdToken();

  const response = await fetch("/api/admin/create-staff", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(data),
  });

  const result = (await response.json()) as
    | CreateStaffResponse
    | CreateStaffErrorResponse;

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("FORBIDDEN");
    }
    throw new Error(
      "error" in result ? result.error : AUTH_ERRORS.CREATE_STAFF_FAILED
    );
  }

  return result as CreateStaffResponse;
}
