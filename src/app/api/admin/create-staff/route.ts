import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/adminApp";
import { createStaffSchema } from "@/types/user";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.slice(7);
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const adminDb = getAdminFirestore();
    const callerDoc = await adminDb.collection("users").doc(decoded.uid).get();

    if (!callerDoc.exists || callerDoc.data()?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: unknown = await request.json();
    const parsed = createStaffSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { email, password, name, role } = parsed.data;
    const userRecord = await getAdminAuth().createUser({
      email,
      password,
      displayName: name,
    });

    await adminDb.collection("users").doc(userRecord.uid).set({
      email,
      name,
      role,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ uid: userRecord.uid });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "FIREBASE_ADMIN_NOT_CONFIGURED"
    ) {
      return NextResponse.json(
        { error: "Firebase Admin is not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create staff account" },
      { status: 500 }
    );
  }
}
