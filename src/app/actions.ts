'use server';

import { generateStyleFlow } from '@/ai/flows/generate-style-flow';
import type { GenerateStyleInput } from '@/ai/schemas';

export async function generateStyle(styleImageDataUri: string, prompt: string) {
  try {
    const input: GenerateStyleInput = { styleImageDataUri, prompt };
    const result = await generateStyleFlow(input);
    return { success: true, texture: result.textureDataUri };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || 'An unknown error occurred.' };
  }
}
