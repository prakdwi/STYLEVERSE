'use server';
/**
 * @fileOverview A flow for generating a texture based on a style image.
 * 
 * - generateStyleFlow - A function that handles the texture generation process.
 */

import { ai } from '@/ai/genkit';
import { GenerateStyleInputSchema, GenerateStyleOutputSchema, type GenerateStyleInput } from '@/ai/schemas';
import { googleAI } from '@genkit-ai/google-genai';

async function generateStyle(input: GenerateStyleInput) {
    const promptText = 'Analyze the style, colors, and patterns of the following image and generate a new, seamless texture that captures its artistic essence. The texture should be a creative interpretation of the style, not a direct copy of the image.';
  
    const { text } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: [
        {text: promptText},
        {media: { url: input.styleImageDataUri, contentType: 'image/jpeg' }}
      ],
    });

    if (!text) {
      throw new Error('Image generation failed to generate description.');
    }
    
    return {
      textureDataUri: text,
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
