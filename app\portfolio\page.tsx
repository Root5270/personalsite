import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { ProjectCard } from "@/components/project-card";
import { SiteHeader } from "@/components/site-header";
import { getPublishedProjects } from "@/lib/data";

export const revalidate = 60;

const capabilities = [
  { no: "01", title: "问题定义", body: "从模糊需求里识别真正的问题，把用户、业务和技术约束整理成可行动的设计判断。" },
  { no: "02", title: "AI 体验", body: "关注 AI 的不确定性、反馈、确认和失败恢复，让能力被理解，也让用户始终保有控制。" },
  { no: "03", title: "视觉系统", body: "用清晰的信息层级、组件规则与视觉叙事，让产品在不同场景里保持一致并建立记忆。" },
  { no: "04", title: "协作交付", body: "连接产品、设计和开发，从流程、原型到可运行版本共同推进，而不止停留在效果图。" },
];

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();
  return (
    <main id="top" className="portfolio-page">
      <SiteHeader />
      <section className="portfolio-hero page-shell">
        <div className="hero-copy">
          <p className="eyebrow">AI VISUAL DESIGNER · BASED IN CHINA</p>
          <h1>让智能有形，<br />让体验<br /><em>更有温度。</em></h1>
          <div className="hero-subrow">
            <p>AI 产品体验、视觉系统与品牌叙事。<br />把复杂技术翻译成清晰、可信任的体验。</p>
            <a className="text-link" href="#work">查看精选项目 ↓</a>
          </div>
        </div>
        <div className="hero-collage" aria-label="精选作品预览">
          <div className="hero-card hero-card-main"><Image src="/assets/luma-cover.jpg" alt="Luma Bar AI 桌面 Agent 项目视觉" fill loading="eager" sizes="(max-width: 760px) 88vw, 42vw" /></div>
          <div className="hero-card hero-card-small"><Image src="/assets/meet-detail.png" alt="遇见集 AI 旅行记录产品界面" fill loading="eager" sizes="(max-width: 760px) 42vw, 18vw" /></div>
          <span className="hero-note">Ideas into<br />clear experiences.</span>
        </div>
      </section>

      <section className="about-section page-shell" id="about" aria-labelledby="about-title">
        <div className="about-portrait"><Image src="/assets/profile-portrait.jpg" alt="利惠琴 Alina Li 的个人照片" fill sizes="(max-width: 760px) 100vw, 36vw" /></div>
        <div className="about-copy">
          <p className="eyebrow">ABOUT · 关于我</p>
          <h2 id="about-title">把技术能力翻译成<br />人能理解的视觉与体验。</h2>
          <p className="about-lead">我是利惠琴（Alina Li），一名关注 AI 产品体验与视觉系统的设计师。我擅长在复杂技术、用户感受和交付边界之间找到清晰表达。</p>
          <div className="contact-line">
            <a href="mailto:1339028224@qq.com">1339028224@qq.com</a>
            <a href="tel:+8618211452787">+86 182 1145 2787</a>
          </div>
          <div className="stats">
            <div><strong>04</strong><span>精选项目</span></div>
            <div><strong>03</strong><span>竞赛奖项</span></div>
            <div><strong>01</strong><span>持续目标：让 AI 更好懂</span></div>
          </div>
        </div>
      </section>

      <section className="work-section page-shell" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <div><p className="eyebrow">SELECTED WORK · 2026</p><h2 id="work-title">精选项目</h2></div>
          <p>从产品定义到视觉交付，选择那些真正改变理解与行动的设计时刻。</p>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => <ProjectCard key={project.id} project={project} featured={index === 0} />)}
        </div>
      </section>

      <section className="capabilities-section page-shell" id="capabilities" aria-labelledby="capabilities-title">
        <div className="section-heading">
          <div><p className="eyebrow">CAPABILITIES</p><h2 id="capabilities-title">我擅长什么</h2></div>
          <p>不把设计当作最后一层包装，而是用它梳理问题、建立共识并推进落地。</p>
        </div>
        <div className="capability-list">
          {capabilities.map((item) => (
            <article key={item.no} className="capability-item">
              <span>{item.no}</span><h3>{item.title}</h3><p>{item.body}</p><b aria-hidden="true">↗</b>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="page-shell contact-layout">
          <div>
            <p className="eyebrow">LET&apos;S WORK TOGETHER</p>
            <h2 id="contact-title">有值得一起<br />做成的想法吗？</h2>
            <p>欢迎聊聊 AI 产品、视觉系统、品牌表达，或者一个还没有被说清楚的问题。</p>
            <a className="mail-link" href="mailto:1339028224@qq.com">也可以直接发邮件 ↗</a>
          </div>
          <ContactForm />
        </div>
        <footer className="page-shell footer-row">
          <span>ALINA LI · AI VISUAL DESIGNER</span>
          <Link href="/admin/login">ADMIN</Link>
          <a href="#top">BACK TO TOP ↑</a>
        </footer>
      </section>
    </main>
  );
}
