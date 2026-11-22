import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";

const knownSlugs = new Set(projects.map((project) => project.slug));

export const config = {
  matcher: "/work/:slug",
};

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (knownSlugs.has(slug)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/work-not-found", request.url));
}
