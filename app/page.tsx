import Image from "next/image";
import Link from "next/link";
import { IntroScene } from "@/components/intro-scene";

export default function IntroPage() {
  return (
    <main className="intro-page">
      <IntroScene>
        <div className="intro-grid" aria-hidden="true" />
        <div className="intro-glow" aria-hidden="true" />
        <div className="intro-topline">
          <Link className="wordmark" href="/portfolio">Alina Li<span>®</span></Link>
          <span>AI VISUAL DESIGNER · 2026</span>
        </div>
        <div className="floating-card card-one" aria-hidden="true"><Image src="/assets/luma-cover.jpg" alt="" fill sizes="320px" /></div>
        <div className="floating-card card-two" aria-hidden="true"><Image src="/assets/meet-map.png" alt="" fill sizes="220px" /></div>
        <div className="floating-card card-three" aria-hidden="true"><Image src="/assets/driftlearn-cover.png" alt="" fill sizes="180px" /></div>
        <section className="intro-content" aria-labelledby="intro-title">
          <p className="intro-label"><span /> AI × VISUAL × EXPERIENCE</p>
          <h1 id="intro-title">让 AI 有形，<br />让复杂变得清晰。</h1>
          <p>将智能能力转化为可理解、可信任、愿意使用的视觉与体验。</p>
          <Link className="enter-link" href="/portfolio">进入作品集 <span aria-hidden="true">↗</span></Link>
        </section>
        <p className="intro-foot">SCROLL IS OPTIONAL · CURIOSITY IS REQUIRED</p>
      </IntroScene>
    </main>
  );
}
