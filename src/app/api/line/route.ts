// src/app/api/line-callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/app/lib/firebaseAdmin'; 
import fetch from 'node-fetch';
import { db } from '@/app/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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

  
  const data = await response.json();
  console.log("data: ",data);
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${data.error || 'Unknown error'}`);
  }
  
  return data;
};

const getLineUserProfile = async ( idToken: string) => {
  const response = await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      id_token: idToken,
      client_id: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID!,
    }),
  });

  const profile = await response.json();
  return {
    uid: profile.sub, 
    displayName: profile.name || null,
    photoURL: profile.picture || null,
    email: profile.email || null, 
  };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
 
  try {
    const { access_token,id_token } = await getLineAccessToken(code as string);
    const profile = await getLineUserProfile(id_token);

    if (!profile.uid) {
      throw new Error("User ID not found in LINE profile");
    }
    
    console.log("line profile: ",profile)

    const firebaseToken = await admin.auth().createCustomToken(profile.uid);
    console.log("Generated Firebase Token:", firebaseToken);

    const userRef = doc(db, "users", profile.uid);
    await setDoc(
      userRef,
      {
        name: profile.displayName,
        email: profile.email,
        photoURL: profile.photoURL,
      },
      { merge: true }
    );

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/signin/line-callback?firebaseToken=${firebaseToken}`);

    return response;
  } catch (error) {
    console.error('Error in LINE callback:', error);
    return new NextResponse('Authentication failed', { status: 500 });
  }
}