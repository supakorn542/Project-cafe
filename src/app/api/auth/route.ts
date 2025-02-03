
import { NextRequest, NextResponse } from 'next/server';
import { admin } from "../../lib/firebaseAdmin";
import { console } from "inspector";



export async function POST(req: NextRequest) {

  ; 
  const { token } = await req.json(); 

  
 

  if (!token || typeof token !== 'string') {
    
    return new Response(JSON.stringify({ success: false, message: "Invalid token format" }), { status: 400 });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    ;
    const userRole = decodedToken.role;




    return new Response(JSON.stringify({ success: true, role: userRole }), { status: 200 });
  } catch (error) {
    ;
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  }
}
