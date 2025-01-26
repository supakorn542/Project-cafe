import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/app/lib/firebaseAdmin";


export async function POST(request: NextRequest) {
    try {
      const { uid, role } = await request.json();
  
      if (!uid || !role) {
        return NextResponse.json({ error: "Missing uid or role" }, { status: 400 });
      }

      await admin.auth().setCustomUserClaims(uid, { role });
  
      return NextResponse.json({ message: `Role ${role} assigned to user ${uid}` });
    } catch (error) {
      console.error("Error setting custom claims:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }