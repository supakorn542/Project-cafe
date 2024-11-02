import { NextApiRequest, NextApiResponse } from "next";
import { admin } from "../../lib/firebaseAdmin";

export async function POST(req: Request) {
    const { token } = await req.json(); // รับข้อมูลจาก request body
  
    try {
      await admin.auth().verifyIdToken(token); // ตรวจสอบ token
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ success: false }), { status: 401 });
    }
  }
