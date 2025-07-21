
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
import { Loader2, Sparkles, Image as ImageIcon, Upload, Link as LinkIcon } from 'lucide-react';
import React from 'react';
import { generatePostContent } from '@/ai/flows/generate-post-content';
import { generateCoverImage } from '@/ai/flows/generate-cover-image';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NextImage from 'next/image';

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
  coverImage: z.string().min(1, { message: 'Please provide a cover image URL or upload a file.' }),
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
  const [isGeneratingContent, setIsGeneratingContent] = React.useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      author: post?.author || '',
      tags: post?.tags.join(', ') || '',
      coverImage: post?.coverImage || '',
      content: post?.content || '',
    },
  });
  
  const isGenerating = isGeneratingContent || isGeneratingImage;
  const coverImageValue = form.watch('coverImage');

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

    setIsGeneratingContent(true);
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
        setIsGeneratingContent(false);
    }
  };

  const handleGenerateImage = async () => {
    const title = form.getValues('title');
    if (!title) {
        toast({
            title: 'Title is required',
            description: 'Please enter a title before generating an image.',
            variant: 'destructive',
        });
        return;
    }

    setIsGeneratingImage(true);
    try {
        const result = await generateCoverImage({ title });
        if (result.imageUrl) {
            form.setValue('coverImage', result.imageUrl, { shouldValidate: true });
            toast({ title: 'Image Generated', description: 'AI has generated the cover image.' });
        } else {
            throw new Error('AI did not return an image URL.');
        }
    } catch (error) {
        console.error("AI image generation failed:", error);
        toast({
            title: 'Image Generation Failed',
            description: 'Could not generate image. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('coverImage', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
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
      router.refresh();
    } catch (error) {
      console.error("Submission error:", error);
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
                <Input placeholder="Enter post title" {...field} disabled={isGenerating} />
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
                <Input placeholder="Enter author's name" {...field} disabled={isGenerating} />
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
                <Input placeholder="e.g., Tech, AI, Next.js" {...field} disabled={isGenerating}/>
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
              <FormLabel>Cover Image</FormLabel>
              <Card>
                <CardContent className="p-4 space-y-4">
                  {coverImageValue ? (
                    <div className="relative aspect-video w-full max-w-md mx-auto rounded-md overflow-hidden border">
                      <NextImage
                        src={coverImageValue}
                        alt="Cover image preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full max-w-md mx-auto rounded-md bg-muted flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}

                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload"><Upload className="mr-2"/>Upload</TabsTrigger>
                      <TabsTrigger value="url"><LinkIcon className="mr-2"/>URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                       <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md">
                          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isGenerating}>
                              <Upload className="mr-2"/> Choose File
                          </Button>
                           <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/gif, image/webp"
                            className="hidden"
                          />
                          <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF, WEBP up to 4MB.</p>
                       </div>
                    </TabsContent>
                    <TabsContent value="url">
                      <div className="flex items-center gap-2">
                         <FormControl>
                            <Input placeholder="https://example.com/image.png" {...field} disabled={isGenerating} />
                         </FormControl>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button type="button" variant="outline" className="w-full" onClick={handleGenerateImage} disabled={isGenerating}>
                      {isGeneratingImage ? <Loader2 className="animate-spin mr-2" /> : <ImageIcon className="mr-2" />}
                      Generate Image with AI
                  </Button>
                </CardContent>
              </Card>
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
                    {isGeneratingContent ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                    Generate with AI
                </Button>
              </div>
              <FormControl>
                <Textarea placeholder="Write your post content here, or generate it with AI." {...field} rows={15} disabled={isGenerating} />
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

