import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();
  return (
    <main className="detail-page">
      <header className="detail-header page-shell">
        <Link className="site-logo" href="/portfolio">Alina Li<span>®</span></Link>
        <Link className="text-link" href="/portfolio#work">返回项目列表 ←</Link>
      </header>
      <article>
        <section className="detail-hero page-shell">
          <p className="eyebrow">{project.category} · {project.year}</p>
          <h1>{project.title}</h1>
          <p className="detail-summary">{project.summary}</p>
          <div className="detail-meta"><span>ROLE</span><strong>{project.role}</strong><span>TAGS</span><strong>{project.tags.join(" / ")}</strong></div>
        </section>
        <div className="detail-cover page-shell">
          <Image src={project.images[0].src} alt={project.images[0].alt} fill loading="eager" sizes="100vw" />
        </div>
        <section className="detail-sections page-shell">
          {project.sections.map((section, index) => (
            <div className="detail-section" key={section.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </section>
        {project.images.length > 1 && (
          <section className="detail-gallery page-shell">
            {project.images.slice(1).map((image) => (
              <div className="detail-gallery-image" key={image.src}><Image src={image.src} alt={image.alt} fill sizes="100vw" /></div>
            ))}
          </section>
        )}
      </article>
      <footer className="detail-footer page-shell">
        <p>想了解更多项目细节？</p><a href="mailto:1339028224@qq.com">联系我 ↗</a>
      </footer>
    </main>
  );
}
