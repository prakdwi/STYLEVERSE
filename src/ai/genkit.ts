import {genkit} from 'genkit';
import {googleAI, vertexAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI(), vertexAI()],
  model: googleAI.model('gemini-2.5-flash'),
});
