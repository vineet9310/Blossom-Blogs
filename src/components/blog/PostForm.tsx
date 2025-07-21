'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Post } from '@/types';
import { createPost, updatePost } from '@/lib/posts';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import React from 'react';
import { generatePostContent } from '@/ai/flows/generate-post-content';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  author: z.string().min(2, {
    message: 'Author name must be at least 2 characters.',
  }),
  tags: z.string().min(1, {
    message: 'Please add at least one tag.',
  }),
  coverImage: z.string().url({ message: 'Please enter a valid URL.' }),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }),
});

type PostFormProps = {
  post?: Post;
};

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      author: post?.author || '',
      tags: post?.tags.join(', ') || '',
      coverImage: post?.coverImage || 'https://placehold.co/1200x600.png',
      content: post?.content || '',
    },
  });

  const handleGenerateContent = async () => {
    const title = form.getValues('title');
    if (!title) {
        toast({
            title: 'Title is required',
            description: 'Please enter a title before generating content.',
            variant: 'destructive',
        });
        return;
    }

    setIsGenerating(true);
    try {
        const result = await generatePostContent({ title });
        if (result.content) {
            form.setValue('content', result.content, { shouldValidate: true });
            toast({ title: 'Content Generated', description: 'AI has generated the post content.' });
        } else {
            throw new Error('AI did not return content.');
        }
    } catch (error) {
        console.error("AI content generation failed:", error);
        toast({
            title: 'Generation Failed',
            description: 'Could not generate content. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsGenerating(false);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const postData = {
      ...values,
      tags: values.tags.split(',').map((tag) => tag.trim()),
    };

    try {
      if (post) {
        await updatePost(post.id, postData);
        toast({ title: 'Success', description: 'Post updated successfully.' });
      } else {
        await createPost(postData);
        toast({ title: 'Success', description: 'Post created successfully.' });
      }
      router.push('/admin/posts');
      router.refresh(); // To reflect changes in the posts list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Enter author's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Tech, AI, Next.js" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Content (Markdown)</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={handleGenerateContent} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
                    Generate with AI
                </Button>
              </div>
              <FormControl>
                <Textarea placeholder="Write your post content here, or generate it with AI." {...field} rows={15} />
              </FormControl>
              <FormDescription>
                The AI will generate content based on the post title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || isGenerating}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : (post ? 'Update Post' : 'Create Post')}
        </Button>
      </form>
    </Form>
  );
}
