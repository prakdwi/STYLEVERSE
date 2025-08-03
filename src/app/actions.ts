'use server';

import { generateStyleRecommendations, type StyleRecommendationsInput } from '@/ai/flows/generate-style-recommendations';

export async function getAIRecommendations(input: StyleRecommendationsInput) {
  try {
    const result = await generateStyleRecommendations(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI recommendation error:', error);
    return { success: false, error: 'Failed to get style recommendations from AI.' };
  }
}
