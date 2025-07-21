import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import PostForm from '@/components/blog/PostForm';

export default async function EditPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}
