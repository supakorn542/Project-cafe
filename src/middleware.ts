import { NextResponse,  NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  

  if (!token) {
    
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  try {
  
    const verifyTokenResponse = await fetch(new URL("/api/auth", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });



    if (!verifyTokenResponse.ok) {
      throw new Error("Invalid or expired token");
    }

    const { role } = await verifyTokenResponse.json();
    const pathname = request.nextUrl.pathname;

    // ตรวจสอบสิทธิ์การเข้าถึงหน้า
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/user") && !["user", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }





  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/user/profile","/admin/products/menu"],
};

