"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link className="site-logo" href="/" aria-label="返回视觉首页">
        Alina Li<span>®</span>
      </Link>
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "关闭" : "菜单"}
      </button>
      <nav id="primary-nav" className={open ? "primary-nav is-open" : "primary-nav"} aria-label="主导航">
        <a href="#about" onClick={() => setOpen(false)}>关于</a>
        <a href="#work" onClick={() => setOpen(false)}>项目</a>
        <a href="#capabilities" onClick={() => setOpen(false)}>能力</a>
      </nav>
      <a className="header-contact" href="#contact">
        联系我 <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
