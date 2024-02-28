import { NextResponse } from "next/server";





export function middleware(request) {
  


    const path = request.nextUrl.pathname
    


    const isPublicPath = path === "/login" || path === "/signup" || path === "/"


    const token = request.cookies.get("token")?.value || "" 
    const name = request.cookies.get("name")?.value || "" 
    

   



    if (isPublicPath && token) {
        return NextResponse.redirect(new URL(`/profile/${name}`, request.nextUrl))
    }

    if ( token && path !== `/profile/${name}`) {
        return NextResponse.redirect(new URL(`/profile/${name}`, request.nextUrl))
    }

  

    if(!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl))
    }
}

export const config = {
    matcher: [
        "/",
        "/profile",
        "/login",
        "/signup",
        "/profile/:path*"
    ]
}