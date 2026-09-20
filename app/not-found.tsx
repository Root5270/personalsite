import Link from "next/link";

export default function NotFound() {
  return <main className="center-page"><p className="eyebrow">404</p><h1>这个页面还没有被设计。</h1><Link className="primary-button" href="/portfolio">回到作品集</Link></main>;
}
