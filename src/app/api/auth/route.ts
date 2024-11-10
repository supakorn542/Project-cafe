import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from 'next/server';
import { admin } from "../../lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const { token } = await req.json(); 
  console.log("Received Token:", token); 

  if (!token || typeof token !== 'string') {
    console.error("Invalid token format:", token);
    return new Response(JSON.stringify({ success: false, message: "Invalid token format" }), { status: 400 });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken); 
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  }
}
