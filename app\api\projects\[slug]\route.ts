import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/data";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const project = await getProjectBySlug((await params).slug);
  return project
    ? NextResponse.json({ project })
    : NextResponse.json({ error: "没有找到这个项目。" }, { status: 404 });
}
