'use server';
/**
 * @fileOverview A flow for generating a texture based on a style image.
 * 
 * - generateStyleFlow - A function that handles the texture generation process.
 */

import { ai } from '@/ai/genkit';
import { GenerateStyleInputSchema, GenerateStyleOutputSchema, type GenerateStyleInput } from '@/ai/schemas';

async function generateStyle(input: GenerateStyleInput) {
    let promptText = 'Generate a seamless texture in the style of the attached image.';

    if (input.styleImageDataUri.includes('Synthwave')) {
      promptText = 'Generate a seamless texture in a synthwave style, with neon grids and a sunset.'
    } else if (input.styleImageDataUri.includes('Van+Gogh')) {
      promptText = 'Generate a seamless texture in the style of Van Gogh\'s Starry Night.'
    }
  
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
