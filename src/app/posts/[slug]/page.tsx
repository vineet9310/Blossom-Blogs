import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getPosts } from '@/lib/posts';
import { Tag } from '@/components/blog/Tag';
import { PostClientContent } from '@/components/blog/PostClientContent';
import { Calendar, User } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const description = post.content.substring(0, 160).replace(/(\r\n|\n|\r|#)/gm, "");

  return {
    title: `${post.title} | Blossom Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: new Date(post.createdAt).toISOString(),
      authors: [post.author],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.coverImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
            <article className="container mx-auto px-4 py-12 max-w-4xl">
            <header className="mb-8 text-center">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
                {post.tags.map(tag => (
                    <Tag key={tag} tag={tag} />
                ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold font-headline mb-4 text-primary-dark">
                {post.title}
                </h1>
                <div className="flex justify-center items-center gap-x-6 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <time dateTime={new Date(post.createdAt).toISOString()}>
                    {post.createdAt}
                    </time>
                </div>
                </div>
            </header>
            
            <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
                <Image
                src={post.coverImage}
                alt={post.title}
                width={1200}
                height={600}
                data-ai-hint="blog cover"
                priority
                className="w-full h-auto"
                />
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none mx-auto
                prose-headings:font-headline prose-headings:text-primary-dark prose-p:text-foreground/80 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
                </ReactMarkdown>
            </div>
            
            <PostClientContent title={post.title} />
            </article>
        </main>
        <Footer />
    </div>
  );
}
