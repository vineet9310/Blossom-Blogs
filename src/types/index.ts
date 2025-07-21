export type Post = {
  id: string;
  slug: string;
  title: string;
  author: string;
  createdAt: string;
  tags: string[];
  coverImage: string;
  content: string; // Markdown content
};
