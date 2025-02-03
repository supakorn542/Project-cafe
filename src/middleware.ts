import { NextResponse,  NextRequest } from "next/server";
import {jwtDecode} from "jwt-decode";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token || token.trim() === "") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  try {
  
    const decodedToken: { role: string } = jwtDecode(token);

    const { role } = decodedToken; // ดึงค่า role จาก token
    const pathname = request.nextUrl.pathname;

    // ตรวจสอบสิทธิ์การเข้าถึงหน้า
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/user") && !["user", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }





  } catch (error) {
    ;
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/user/profile","/user/cart","/user/orderhistory","/admin/:path*"],
};

