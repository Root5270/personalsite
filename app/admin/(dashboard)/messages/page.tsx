import { deleteMessage, updateMessageStatus } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContactMessage } from "@/lib/types";

const statusLabel = { unread: "未读", processing: "处理中", done: "已完成", spam: "垃圾信息" };

export default async function AdminMessagesPage() {
  const { data } = await createAdminClient()!.from("messages").select("*").order("created_at", { ascending: false });
  const messages = (data || []) as ContactMessage[];
  return (
    <main className="admin-content">
      <div className="admin-heading"><div><p className="eyebrow">INBOX</p><h1>留言管理</h1></div></div>
      {messages.length ? <div className="message-list">
        {messages.map((message) => <article className="message-card" key={message.id}>
          <div className="message-head"><div><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a></div><time>{new Date(message.created_at).toLocaleString("zh-CN")}</time></div>
          <p>{message.content}</p>
          <div className="message-actions"><form action={updateMessageStatus.bind(null, message.id)}><select name="status" defaultValue={message.status}>{Object.entries(statusLabel).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><button type="submit">更新状态</button></form><form action={deleteMessage.bind(null, message.id)}><button className="danger" type="submit">删除</button></form></div>
        </article>)}
      </div> : <div className="empty-state"><h2>目前没有留言</h2><p>访客通过联系表单提交后，会在这里出现。</p></div>}
    </main>
  );
}
