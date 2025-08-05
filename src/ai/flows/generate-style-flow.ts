'use server';
/**
 * @fileOverview A flow for generating a texture based on a style image.
 * 
 * - generateStyleFlow - A function that handles the texture generation process.
 */

import { ai } from '@/ai/genkit';
import { GenerateStyleInputSchema, GenerateStyleOutputSchema, type GenerateStyleInput } from '@/ai/schemas';

async function generateStyle(input: GenerateStyleInput) {
    const promptText = 'Analyze the style, colors, and patterns of the following image and generate a new, seamless texture that captures its artistic essence. The texture should be a creative interpretation of the style, not a direct copy of the image.';
  
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {text: promptText},
        {media: { url: input.styleImageDataUri }}
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed to produce an image.');
    }
    
    return {
      textureDataUri: media.url,
    };
}


export const generateStyleFlow = ai.defineFlow(
  {
    name: 'generateStyleFlow',
    inputSchema: GenerateStyleInputSchema,
    outputSchema: GenerateStyleOutputSchema,
  },
  generateStyle
);
