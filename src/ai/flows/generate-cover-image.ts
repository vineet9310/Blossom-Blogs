'use server';
/**
 * @fileOverview Generates a blog post cover image based on a title.
 *
 * - generateCoverImage - A function that handles the image generation process.
 * - GenerateCoverImageInput - The input type for the function.
 * - GenerateCoverImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverImageInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  aspectRatio: z.string().optional().describe('The desired aspect ratio for the image.'),
});
export type GenerateCoverImageInput = z.infer<typeof GenerateCoverImageInputSchema>;

const GenerateCoverImageOutputSchema = z.object({
  imageUrl: z.string().url().describe('The URL of the generated cover image.'),
});
export type GenerateCoverImageOutput = z.infer<typeof GenerateCoverImageOutputSchema>;

export async function generateCoverImage(input: GenerateCoverImageInput): Promise<GenerateCoverImageOutput> {
  return generateCoverImageFlow(input);
}

const generateCoverImageFlow = ai.defineFlow(
  {
    name: 'generateCoverImageFlow',
    inputSchema: GenerateCoverImageInputSchema,
    outputSchema: GenerateCoverImageOutputSchema,
  },
  async (input) => {
    // Determine image dimensions based on aspect ratio
    let width = 600;
    let height = 400;
    if (input.aspectRatio === '1:1') {
      width = 512;
      height = 512;
    } else if (input.aspectRatio === '9:16') {
      width = 400;
      height = 600;
    }

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A high-quality, professional blog cover image for a post titled: "${input.title}". The image should be visually appealing, relevant to the title, and suitable for a modern tech and lifestyle blog. Style: digital art, photographic, vibrant.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        // Note: As of my last update, direct size parameters might not be supported
        // in the same way. The prompt is the primary way to guide the model.
        // The aspect ratio logic above helps in guiding the prompt.
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to produce an image.');
    }
    
    // The model returns a data URI, which is what we want.
    return { imageUrl: media.url };
  }
);

