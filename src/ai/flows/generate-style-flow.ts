'use server';
/**
 * @fileOverview A flow for generating a texture based on a style image.
 * 
 * - generateStyleFlow - A function that handles the texture generation process.
 */

import { ai } from '@/ai/genkit';
import { GenerateStyleInputSchema, GenerateStyleOutputSchema, type GenerateStyleInput } from '@/ai/schemas';
import { googleAI, vertexAI } from '@genkit-ai/google-genai';

async function generateStyle(input: GenerateStyleInput) {
    const promptText = 'Analyze the style, colors, and patterns of the following image and generate a new, seamless texture that captures its artistic essence. The texture should be a creative interpretation of the style, not a direct copy of the image.';
  
    // First, analyze the style with Gemini
    const { text: styleAnalysis } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: [
        {text: promptText},
        {media: { url: input.styleImageDataUri, contentType: 'image/jpeg' }}
      ],
    });

    if (!styleAnalysis) {
      throw new Error('Failed to analyze style.');
    }
    
    // Then generate image using Imagen based on the analysis
    const { text: imageUrl } = await ai.generate({
      model: vertexAI.model('imagen-3.0-generate-002'),
      prompt: `Create a seamless texture based on this style description: ${styleAnalysis}`,
    });

    if (!imageUrl) {
      throw new Error('Image generation failed to produce an image.');
    }
    
    return {
      textureDataUri: imageUrl,
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
