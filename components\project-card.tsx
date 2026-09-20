import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const image = project.images[0];
  return (
    <article className={featured ? "project-card featured" : "project-card"}>
      <Link href={`/work/${project.slug}`} className="project-image" aria-label={`查看 ${project.title}`}>
        {image && <Image src={image.src} alt={image.alt} fill loading={featured ? "eager" : "lazy"} sizes={featured ? "(max-width: 760px) 100vw, 70vw" : "(max-width: 760px) 100vw, 45vw"} />}
      </Link>
      <div className="project-copy">
        <div>
          <p className="eyebrow">{project.category} · {project.year}</p>
          <h3><Link href={`/work/${project.slug}`}>{project.title}</Link></h3>
        </div>
        <p>{project.summary}</p>
        <Link className="round-link" href={`/work/${project.slug}`} aria-label={`查看 ${project.title} 详情`}>↗</Link>
      </div>
    </article>
  );
}
