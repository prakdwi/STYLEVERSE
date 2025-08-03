import { z } from 'zod';

export const GenerateStyleInputSchema = z.object({
  styleImageDataUri: z
    .string()
    .describe(
      "A style image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('A text prompt describing the desired style for the texture.'),
});
export type GenerateStyleInput = z.infer<typeof GenerateStyleInputSchema>;

export const GenerateStyleOutputSchema = z.object({
  textureDataUri: z
    .string()
    .describe(
      "The generated texture image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateStyleOutput = z.infer<typeof GenerateStyleOutputSchema>;
