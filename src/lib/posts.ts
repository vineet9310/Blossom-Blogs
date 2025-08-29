'use server';

import type { Post } from '@/types';
import { subDays, format } from 'date-fns';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), '.tmp', 'posts.json');
const now = new Date();

const initialMockPosts: Post[] = [
  {
    id: '1',
    slug: 'getting-started-with-nextjs-14',
    title: 'Getting Started with Next.js 14',
    author: 'Jane Doe',
    createdAt: format(subDays(now, 1), 'MMMM d, yyyy'),
    tags: ['Tech', 'Next.js', 'Web Dev'],
    coverImage: 'https://placehold.co/1200x600.png',
    content: `
## Welcome to the Future of Web Development

Next.js 14 brings a new level of performance and developer experience. In this post, we'll explore the key features and how to get started with building your first Next.js 14 application.

### Key Features:
- **Turbopack**: A new, high-speed bundler written in Rust.
- **Server Actions**: Simplified data mutations without the need for API routes.
- **App Router**: A new paradigm for building applications with nested layouts and routes.

\`\`\`javascript
// Example of a Server Action
'use server'
 
export async function myAction() {
  // ...
}
\`\`\`

Getting started is as simple as running \`npx create-next-app@latest\`. Join us on this journey to build faster, more efficient web applications.
    `,
  },
  {
    id: '2',
    slug: 'a-guide-to-mindful-design',
    title: 'A Guide to Mindful Design',
    author: 'John Smith',
    createdAt: format(subDays(now, 3), 'MMMM d, yyyy'),
    tags: ['Design', 'UI/UX', 'Productivity'],
    coverImage: 'https://placehold.co/1200x600.png',
    content: `
## Designing with Intent

Mindful design is about creating interfaces that are not only beautiful but also intuitive and respectful of the user's attention. It's about making conscious choices that lead to better user experiences.

### Principles of Mindful Design:
1.  **Clarity over Clutter**: Prioritize essential information.
2.  **Respect User's Time**: Make interactions efficient.
3.  **Provide Feedback**: Ensure users know the result of their actions.

> Good design is as little design as possible. - Dieter Rams

By applying these principles, we can create products that people love to use.
    `,
  },
  {
    id: '3',
    slug: 'exploring-the-alps-a-travel-diary',
    title: 'Exploring the Alps: A Travel Diary',
    author: 'Alex Johnson',
    createdAt: format(subDays(now, 5), 'MMMM d, yyyy'),
    tags: ['Travel', 'Adventure', 'Photography'],
    coverImage: 'https://placehold.co/1200x600.png',
    content: `
## A Journey Through the Mountains

The Alps are a breathtaking wonder of nature. This post is a collection of memories, photos, and tips from my 10-day trek through the Swiss Alps.

![A beautiful mountain landscape](https://placehold.co/800x400.png)
*A photo from the trail.*

### Highlights:
- **The Matterhorn**: Seeing the iconic peak at sunrise.
- **Local Cuisine**: Cheese fondue is a must-try!
- **Hiking Trails**: Routes for all skill levels.

Whether you're an avid hiker or just love beautiful scenery, the Alps are a destination that should be on your list.
    `,
  },
  {
    id: '4',
    slug: 'the-rise-of-generative-ai',
    title: 'The Rise of Generative AI',
    author: 'Samantha Bee',
    createdAt: format(subDays(now, 8), 'MMMM d, yyyy'),
    tags: ['Tech', 'AI', 'Future'],
    coverImage: 'https://placehold.co/1200x600.png',
    content: `
## A New Era of Technology

Generative AI is transforming industries, from art and music to software development. Models like GPT-4 and DALL-E are capable of creating novel content that was once thought to be exclusively human.

### How does it work?
Generative models are trained on vast datasets and learn patterns to generate new, original outputs. This has profound implications for the future of work and creativity.

\`\`\`python
# Example of using a pseudo-AI library
from awesome_ai import Generator

text_generator = Generator(model="super-creative-v1")
generated_text = text_generator.prompt("Write a poem about robots.")
print(generated_text)
\`\`\`

The potential is limitless, but it also raises important ethical questions that we must address as a society.
    `,
  },
  {
    id: '5',
    slug: 'mastering-tailwind-css',
    title: 'Mastering Tailwind CSS for Rapid UI Development',
    author: 'Jane Doe',
    createdAt: format(subDays(now, 12), 'MMMM d, yyyy'),
    tags: ['Tech', 'Web Dev', 'CSS'],
    coverImage: 'https://placehold.co/1200x600.png',
    content: `
## Build UIs Faster Than Ever

Tailwind CSS is a utility-first CSS framework that allows for rapid development without ever leaving your HTML. It's a different approach compared to frameworks like Bootstrap or Foundation, and it's incredibly powerful.

### Why Tailwind?
- **Highly Customizable**: Configure everything from colors to spacing.
- **No Naming Conventions**: No more \`.btn-primary--large\` classes.
- **Performance**: Ship only the CSS you actually use.

It has a learning curve, but once you get the hang of it, you'll be building beautiful, custom designs in record time.
    `,
  },
  {
    id: '6',
    slug: 'the-art-of-storytelling-in-marketing',
    title: 'The Art of Storytelling in Marketing',
    author: 'John Smith',
    createdAt: format(subDays(now, 15), 'MMMM d, yyyy'),
    tags: ['Marketing', 'Business', 'Storytelling'],
    coverImage: 'https://placehold.co/1200x600.png',
    content: `
## Connect with Your Audience on a Deeper Level

Facts tell, but stories sell. In a crowded marketplace, storytelling is the most powerful tool to capture attention and build a loyal brand following.

### Key Elements of a Great Brand Story:
1.  **A Hero**: Your customer.
2.  **A Goal**: What they want to achieve.
3.  **An Obstacle**: The problem they face.
4.  **A Guide**: Your brand, helping them succeed.

By weaving these elements into your marketing, you create a narrative that resonates emotionally with your audience.
    `,
  },
  {
    id: '7',
    slug: 'sustainable-living-small-changes-big-impact',
    title: 'Sustainable Living: Small Changes, Big Impact',
    author: 'Emily White',
    createdAt: format(subDays(now, 20), 'MMMM d, yyyy'),
    tags: ['Lifestyle', 'Sustainability'],
    coverImage: 'https://placehold.co/1200x600.png',
    content: `
## Living a Greener Life

Adopting a sustainable lifestyle doesn't have to be overwhelming. Small, consistent changes can collectively make a huge difference for our planet.

### Easy Steps to Start:
- **Reduce, Reuse, Recycle**: The classic for a reason.
- **Shop Local**: Support local farmers and reduce your carbon footprint.
- **Conserve Water**: Shorter showers, fixing leaks, and being mindful of usage.

Let's work together to create a healthier planet for future generations.
`
  }
];

const readPosts = async (): Promise<Post[]> => {
  try {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, JSON.stringify(initialMockPosts, null, 2));
  }
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
};

const writePosts = async (posts: Post[]): Promise<void> => {
  await fs.writeFile(dataFilePath, JSON.stringify(posts, null, 2));
};

const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const getPosts = async (): Promise<Post[]> => {
  const posts = await readPosts();
  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = await readPosts();
  const post = posts.find(p => p.slug === slug);
  return post || null;
};

export const getAllTags = async (): Promise<string[]> => {
  const posts = await readPosts();
  const tags = new Set(posts.flatMap(p => p.tags));
  return Array.from(tags);
};

export const createPost = async (data: Omit<Post, 'id' | 'slug' | 'createdAt'>): Promise<Post> => {
  const posts = await readPosts();
  const newPost: Post = {
    ...data,
    id: String(Date.now()),
    slug: createSlug(data.title),
    createdAt: format(new Date(), 'MMMM d, yyyy'),
  };
  posts.unshift(newPost);
  await writePosts(posts);
  revalidatePath('/', 'layout');
  revalidatePath('/admin', 'layout');
  return newPost;
};

export const updatePost = async (id: string, data: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post | null> => {
  let posts = await readPosts();
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return null;
  }
  const originalPost = posts[postIndex];
  const updatedPost: Post = {
    ...originalPost,
    ...data,
    slug: data.title ? createSlug(data.title) : originalPost.slug,
  };
  posts[postIndex] = updatedPost;
  await writePosts(posts);
  revalidatePath('/', 'layout');
  revalidatePath('/admin', 'layout');
  revalidatePath(`/posts/${originalPost.slug}`);
  if (data.title && originalPost.slug !== updatedPost.slug) {
    revalidatePath(`/posts/${updatedPost.slug}`);
  }
  return updatedPost;
};

export const deletePost = async (id: string): Promise<Post | null> => {
  let posts = await readPosts();
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return null;
  }
  const [deletedPost] = posts.splice(postIndex, 1);
  await writePosts(posts);
  revalidatePath('/', 'layout');
  revalidatePath('/admin', 'layout');
  revalidatePath(`/posts/${deletedPost.slug}`);
  return deletedPost;
};
