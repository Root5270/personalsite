import Link from "next/link";
import type { Project } from "@/lib/types";

export function ProjectForm({ project, action }: { project?: Project; action: (formData: FormData) => void | Promise<void> }) {
  const sectionText = project?.sections.map((section) => `${section.title}｜${section.body}`).join("\n") || "";
  const imageText = project?.images.map((image) => `${image.src}｜${image.alt}`).join("\n") || "";
  return (
    <form className="project-editor" action={action}>
      <div className="editor-grid">
        <label>项目名称<input name="title" required maxLength={120} defaultValue={project?.title} /></label>
        <label>英文路径<input name="slug" required pattern="[a-z0-9-]+" placeholder="example-project" defaultValue={project?.slug} /></label>
        <label>项目类型<input name="category" maxLength={80} defaultValue={project?.category} /></label>
        <label>时间<input name="year" maxLength={30} defaultValue={project?.year} /></label>
        <label className="wide">我的角色<input name="role" maxLength={120} defaultValue={project?.role} /></label>
        <label className="wide">项目摘要<textarea name="summary" rows={3} required maxLength={500} defaultValue={project?.summary} /></label>
        <label className="wide">标签（用逗号分隔）<input name="tags" defaultValue={project?.tags.join("，")} /></label>
        <label className="wide">内容章节<span className="field-help">每行一段，格式：标题｜正文</span><textarea name="sections" rows={9} required defaultValue={sectionText} /></label>
        <label className="wide">项目图片<span className="field-help">每行一张，格式：图片地址｜替代文字</span><textarea name="images" rows={5} required defaultValue={imageText} /></label>
        <label>发布状态<select name="status" defaultValue={project?.status || "draft"}><option value="draft">草稿</option><option value="published">已发布</option></select></label>
        <label>排序<input name="sort_order" type="number" min="0" max="10000" defaultValue={project?.sort_order || 0} /></label>
      </div>
      <div className="editor-actions"><Link href="/admin/projects">取消</Link><button className="primary-button" type="submit">保存作品 ↗</button></div>
    </form>
  );
}
