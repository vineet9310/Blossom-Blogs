import { getPosts, getAllTags } from '@/lib/posts';
import { BlogLayout } from '@/components/blog/BlogLayout';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const revalidate = 0; // Revalidate on every request
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch all posts to ensure AI search has access to the full dataset
  const allPosts = await getPosts(); 
  const tags = await getAllTags();

  return (
    <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
            <div className="container mx-auto px-4 py-12">
                <BlogLayout initialPosts={allPosts} allTags={tags} />
            </div>
        </main>
        <Footer />
    </div>
  );
}
