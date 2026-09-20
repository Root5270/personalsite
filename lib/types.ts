export type ProjectSection = {
  title: string;
  body: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  role: string;
  year: string;
  summary: string;
  sections: ProjectSection[];
  images: ProjectImage[];
  tags: string[];
  status: "draft" | "published";
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  content: string;
  status: "unread" | "processing" | "done" | "spam";
  created_at: string;
};
