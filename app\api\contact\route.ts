import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(60),
  email: z.email().max(254),
  message: z.string().trim().min(10).max(3000),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "提交格式有误。" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "请填写姓名、有效邮箱、10–3000 字的留言，并同意用于联系回复。" }, { status: 422 });
  }

  const client = createAdminClient();
  if (!client) {
    return NextResponse.json({ error: "留言服务尚未连接，请暂时直接发送邮件。" }, { status: 503 });
  }

  const { error } = await client.from("messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    content: parsed.data.message,
  });
  if (error) {
    console.error("contact insert failed", error.code);
    return NextResponse.json({ error: "暂时无法保存，请稍后重试或直接发送邮件。" }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
