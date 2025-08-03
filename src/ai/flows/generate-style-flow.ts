'use server';
/**
 * @fileOverview A flow for generating a texture based on a style image and a prompt.
 * 
 * - generateStyleFlow - A function that handles the texture generation process.
 */

import { ai } from '@/ai/genkit';
import { GenerateStyleInputSchema, GenerateStyleOutputSchema, type GenerateStyleInput } from '@/ai/schemas';

async function generateStyle(input: GenerateStyleInput) {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {text: `Generate a seamless texture. The texture should be in the style of the attached image, and match the following description: ${input.prompt}.`},
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
