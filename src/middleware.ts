import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  if (!token) {
    
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  try {
    // ตรวจสอบ token โดยส่งไปที่ API ของ Firebase
    const verifyTokenResponse = await fetch(new URL("/api/auth", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.value }),
    });

    if (!verifyTokenResponse.ok) {
      // หาก token หมดอายุหรือไม่ถูกต้อง ให้ redirect ไปหน้า sign-in
      throw new Error("Invalid or expired token");
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/user/profile",
};


// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
//   // ตรวจสอบ Token ใน Cookie
//   const token = request.cookies.get("token");

//   // ถ้าไม่มี Token ให้ redirect ไปหน้า Sign In
//   if (!token) {
//     return NextResponse.redirect(new URL("/signin", request.url));
//   }

//   // อนุญาตให้คำขอผ่านไปได้
//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/user", // กำหนดเส้นทางที่ต้องการใช้ middleware
// };
