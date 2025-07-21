'use server';
/**
 * @fileOverview Generates blog post content based on a title.
 *
 * - generatePostContent - A function that handles the content generation process.
 * - GeneratePostContentInput - The input type for the function.
 * - GeneratePostContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostContentInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
});
export type GeneratePostContentInput = z.infer<typeof GeneratePostContentInputSchema>;

const GeneratePostContentOutputSchema = z.object({
  content: z.string().describe('The generated markdown content for the blog post.'),
});
export type GeneratePostContentOutput = z.infer<typeof GeneratePostContentOutputSchema>;

export async function generatePostContent(input: GeneratePostContentInput): Promise<GeneratePostContentOutput> {
  return generatePostContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePostContentPrompt',
  input: {schema: GeneratePostContentInputSchema},
  output: {schema: GeneratePostContentOutputSchema},
  prompt: `You are an expert content writer specializing in creating engaging and informative blog posts.

Your task is to generate a well-structured blog post in Markdown format based on the provided title.

The post should include:
- An engaging introduction.
- At least two main sections with headings (##).
- A concluding paragraph.
- Use of Markdown for formatting, such as bold text, lists, and code snippets where appropriate.

Do not include the main title in the output, as it already exists.

Blog Post Title: {{{title}}}
`,
});

const generatePostContentFlow = ai.defineFlow(
  {
    name: 'generatePostContentFlow',
    inputSchema: GeneratePostContentInputSchema,
    outputSchema: GeneratePostContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
