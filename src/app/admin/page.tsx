import Link from 'next/link';
import { getPosts, getAllTags } from '@/lib/posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, PlusCircle, Tag } from 'lucide-react';

export default async function AdminDashboard() {
  const posts = await getPosts();
  const tags = await getAllTags();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">
              posts currently on the blog
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
            <p className="text-xs text-muted-foreground">
              unique tags across all posts
            </p>
          </CardContent>
        </Card>
      </div>
       <div className="mt-8">
            <h2 className="text-2xl font-bold font-headline mb-4">Recent Posts</h2>
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {posts.slice(0, 5).map((post) => (
                            <div key={post.id} className="p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground">{post.author} - {post.createdAt}</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/posts/${post.slug}/edit`}>Edit</Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
