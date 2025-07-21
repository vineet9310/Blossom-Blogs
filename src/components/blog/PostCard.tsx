import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from '@/components/blog/Tag';
import { Calendar, User } from 'lucide-react';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={225}
              data-ai-hint="blog cover"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <CardTitle className="font-headline text-xl mb-2 line-clamp-2">{post.title}</CardTitle>
          <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.createdAt}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map(tag => (
              <Tag key={tag} tag={tag} className="px-2 py-1 text-xs" />
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
