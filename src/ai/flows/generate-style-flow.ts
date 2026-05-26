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
    const promptText = 'Analyze the style, colors, and patterns of the following image. Respond ONLY with a valid JSON object (no markdown, no code blocks): { "primaryColor": "#RRGGBB", "secondaryColor": "#RRGGBB", "pattern": "description", "intensity": 0.5 }';
  
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
    
    // Parse the style analysis - handle potential markdown formatting
    let styleData;
    try {
      // Try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = styleAnalysis.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : styleAnalysis;
      styleData = JSON.parse(jsonStr);
    } catch (error) {
      throw new Error(`Failed to parse style data: ${error}`);
    }
    
    // Generate a procedural texture canvas data URL
    const canvas = createProceduralTexture(styleData);
    const textureDataUri = canvas.toDataURL();
    
    return {
      textureDataUri,
    };
}

function createProceduralTexture(styleData: any): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 512;
  canvas.height = 512;
  
  const primaryColor = styleData.primaryColor || '#8B7355';
  const secondaryColor = styleData.secondaryColor || '#D4A574';
  const intensity = styleData.intensity || 0.5;
  
  // Fill with gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, primaryColor);
  gradient.addColorStop(1, secondaryColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add noise pattern
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * intensity * 50;
    data[i] += noise;     // R
    data[i + 1] += noise; // G
    data[i + 2] += noise; // B
  }
  ctx.putImageData(imageData, 0, 0);
  
  return canvas;
}


export const generateStyleFlow = ai.defineFlow(
  {
    name: 'generateStyleFlow',
    inputSchema: GenerateStyleInputSchema,
    outputSchema: GenerateStyleOutputSchema,
  },
  generateStyle
);
