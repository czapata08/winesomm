import { NextRequest, NextResponse } from "next/server";

// only run middleware on home page
export const config = {
  matcher: "/home",
};

export default function middleware(req: NextRequest) {
  const country = req.geo?.country?.toLowerCase() || "us";
  const locale = req.headers.get("accept-language")?.split(",")?.[0] || "en-US";

  console.log("locale: ", locale, "country:", country);

  // Rewrite the path (`/`) to the localized page (pages/[locale]/[country])
  req.nextUrl.pathname = `/${locale}/${country}`;
  return NextResponse.rewrite(req.nextUrl);
}

//ts-ignore
