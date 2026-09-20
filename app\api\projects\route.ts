import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ projects: await getPublishedProjects() });
}
