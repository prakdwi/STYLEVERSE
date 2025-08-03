// This is a server-side file.
'use server';

/**
 * @fileOverview Generates style recommendations for a 3D model based on a text prompt or an image.
 *
 * - generateStyleRecommendations - A function that generates style recommendations.
 * - StyleRecommendationsInput - The input type for the generateStyleRecommendations function.
 * - StyleRecommendationsOutput - The return type for the generateStyleRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleRecommendationsInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired style.'),
});

export type StyleRecommendationsInput = z.infer<typeof StyleRecommendationsInputSchema>;

const StyleRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.string().describe('A style recommendation based on the prompt.')
  ).describe('A list of style recommendations.')
});

export type StyleRecommendationsOutput = z.infer<typeof StyleRecommendationsOutputSchema>;

export async function generateStyleRecommendations(input: StyleRecommendationsInput): Promise<StyleRecommendationsOutput> {
  return generateStyleRecommendationsFlow(input);
}

const styleRecommendationsPrompt = ai.definePrompt({
  name: 'styleRecommendationsPrompt',
  input: {schema: StyleRecommendationsInputSchema},
  output: {schema: StyleRecommendationsOutputSchema},
  prompt: `You are a style consultant for 3D models.

  Based on the following prompt, generate a list of style recommendations for a 3D model.
  The style should be coherent and able to be applied to a 3D model.

  Prompt: {{{prompt}}}

  Return the recommendations as a JSON array of strings. Do not include any additional text.`,
});

const generateStyleRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateStyleRecommendationsFlow',
    inputSchema: StyleRecommendationsInputSchema,
    outputSchema: StyleRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await styleRecommendationsPrompt(input);
    return output!;
  }
);
