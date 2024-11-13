import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from 'next/server';
import { admin } from "../../lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const { token } = await req.json(); 
 

  if (!token || typeof token !== 'string') {
    
    return new Response(JSON.stringify({ success: false, message: "Invalid token format" }), { status: 400 });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
   
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  }
}
