"use client";

import { FormEvent, useState } from "react";

type FormStatus = { type: "idle" | "loading" | "success" | "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setStatus({ type: "loading", message: "正在发送…" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, consent: values.consent === "on" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "暂时无法发送。");
      form.reset();
      setStatus({ type: "success", message: "已收到你的消息，我会尽快回复。" });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "暂时无法发送。" });
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>称呼<input name="name" required maxLength={60} autoComplete="name" /></label>
        <label>邮箱<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
      </div>
      <label>想聊些什么？<textarea name="message" required minLength={10} maxLength={3000} rows={5} /></label>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="consent"><input name="consent" type="checkbox" required /> 同意将以上信息用于联系回复</label>
      <button className="primary-button" type="submit" disabled={status.type === "loading"}>
        {status.type === "loading" ? "发送中" : "发送消息"} <span aria-hidden="true">↗</span>
      </button>
      <p className={`form-status ${status.type}`} role="status" aria-live="polite">{status.message}</p>
    </form>
  );
}
