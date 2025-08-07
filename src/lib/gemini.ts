import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// Text model
export const textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Image analysis model (for analyzing images, not generating them)
export const imageModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: unknown) {
    console.error('Error generating text:', error);
    
    // Handle rate limiting and quota errors
    if (error && typeof error === 'object' && 'status' in error && error.status === 429) {
      return "I'm currently experiencing high demand. Please try again in a few minutes. This is due to API rate limits on the free tier.";
    }
    
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return "I'm currently experiencing high demand. Please try again in a few minutes. This is due to API rate limits on the free tier.";
      }
      
      if (error.message.includes('not found')) {
        return "I'm having trouble connecting to my AI service right now. Please try again later.";
      }
    }
    
    // Generic error response
    return "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.";
  }
}

// Note: Gemini API doesn't support image generation, only image analysis
// For image generation, we use Stable Diffusion or Hugging Face APIs in the route handler 