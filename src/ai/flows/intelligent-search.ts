// src/ai/flows/intelligent-search.ts
'use server';

/**
 * @fileOverview Implements intelligent search for blog posts using AI to compare search terms with post titles and tags.
 *
 * - intelligentSearch - A function that performs the intelligent search.
 * - IntelligentSearchInput - The input type for the intelligentSearch function.
 * - IntelligentSearchOutput - The return type for the intelligentSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentSearchInputSchema = z.object({
  searchTerm: z.string().describe('The search term entered by the user.'),
  postTitle: z.string().describe('The title of the blog post.'),
  postTags: z.array(z.string()).describe('The tags associated with the blog post.'),
});
export type IntelligentSearchInput = z.infer<typeof IntelligentSearchInputSchema>;

const IntelligentSearchOutputSchema = z.object({
  isRelevant: z.boolean().describe('Whether the blog post is relevant to the search term.'),
  reason: z.string().optional().describe('The reason for the relevance or irrelevance.'),
});
export type IntelligentSearchOutput = z.infer<typeof IntelligentSearchOutputSchema>;

export async function intelligentSearch(input: IntelligentSearchInput): Promise<IntelligentSearchOutput> {
  return intelligentSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentSearchPrompt',
  input: {schema: IntelligentSearchInputSchema},
  output: {schema: IntelligentSearchOutputSchema},
  prompt: `You are an AI assistant that determines the relevance of a blog post to a given search term.

You will receive a search term, a blog post title, and an array of blog post tags.
Your task is to determine whether the blog post is relevant to the search term. Consider that the search term doesn't need to be an exact match but the overall meaning and intent of the search term and title/tags should be similar.

Search Term: {{{searchTerm}}}
Blog Post Title: {{{postTitle}}}
Blog Post Tags: {{#each postTags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Based on this information, determine if the blog post is relevant to the search term. Return a boolean value for isRelevant. Also provide a brief reason for your determination. Focus on if the search term, title, and tags align with the context of each other.

Output in JSON format:
{
  "isRelevant": boolean,
  "reason": string
}
`,
});

const intelligentSearchFlow = ai.defineFlow(
  {
    name: 'intelligentSearchFlow',
    inputSchema: IntelligentSearchInputSchema,
    outputSchema: IntelligentSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
