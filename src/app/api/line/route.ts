// src/app/api/line-callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/app/lib/firebaseAdmin'; 
import fetch from 'node-fetch';

const getLineAccessToken = async (code: string) => {
  const response = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.NEXT_PUBLIC_LINE_CALLBACK_URL!,
      client_id: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID!,
      client_secret: process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET!,
    }),
  });

  
  return response.json();
};

const getLineUserProfile = async (accessToken: string) => {
  const response = await fetch('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const profile = await response.json();
  return {
    uid: profile.userId,
    displayName: profile.displayName || null,
    photoURL: profile.pictureUrl || null,
    email: profile.email || null,
  };
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    try {
      const { access_token } = await getLineAccessToken(code as string);
      const profile = await getLineUserProfile(access_token);
  
      // ตรวจสอบว่า profile มีค่า userId ที่ถูกต้องหรือไม่
      if (!profile.uid) {
        throw new Error("User ID not found in LINE profile");
      }
  
      const firebaseToken = await admin.auth().createCustomToken(profile.uid);
      
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/signin?firebaseToken=${firebaseToken}`);
    } catch (error) {
      console.error('Error in LINE callback:', error);
      return new NextResponse('Authentication failed', { status: 500 });
    }
  }