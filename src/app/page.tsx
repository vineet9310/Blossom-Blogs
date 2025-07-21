import { getPosts, getAllTags } from '@/lib/posts';
import { BlogLayout } from '@/components/blog/BlogLayout';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  // Fetch all posts to ensure AI search has access to the full dataset
  const allPosts = await getPosts(); 
  const tags = await getAllTags();

  return (
    <div className="container mx-auto px-4 py-12">
      <BlogLayout initialPosts={allPosts} allTags={tags} />
    </div>
  );
}
