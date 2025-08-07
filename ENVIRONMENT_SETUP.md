# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### For Chat Functionality (Gemini API)
```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

### For AI Image Generation (Hugging Face - Recommended Free Option)
```env
HF_API_KEY=your_huggingface_api_key_here
```

**Why Hugging Face?**
- ✅ **Completely free** tier available
- ✅ **Good quality** AI-generated images
- ✅ **Community-driven models**
- ✅ **No credit card required**
- ✅ **Reliable and fast**

### Alternative Image Generation APIs (Optional)

#### Option 1: OpenAI DALL-E (Highest Quality - Paid)
```env
OPENAI_API_KEY=your_openai_api_key_here
```
- Get your API key from: https://platform.openai.com/api-keys
- Pricing: $0.040 per image (1024x1024)
- Best quality and consistency
- Fast generation

#### Option 2: Stability AI (Free tier available)
```env
STABILITY_API_KEY=your_stability_api_key_here
```
- Get your API key from: https://platform.stability.ai/
- Free tier: 25 images per month
- High quality image generation
- Good for artistic styles

#### Option 3: Replicate (Multiple models - Pay per use)
```env
REPLICATE_API_KEY=your_replicate_api_key_here
```
- Get your API key from: https://replicate.com/
- Pay per generation (~$0.01-0.05 per image)
- Access to multiple AI models
- Good for experimentation

#### Option 4: Leonardo AI (High quality - Paid)
```env
LEONARDO_API_KEY=your_leonardo_api_key_here
```
- Get your API key from: https://leonardo.ai/
- Paid service with credits
- High quality artistic images
- Good for creative projects

#### Option 5: Unsplash (Fallback - existing images only)
```env
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```
- Get your API key from: https://unsplash.com/developers
- Free tier: 50 requests per hour
- Note: This searches existing images, doesn't generate new ones

### For Database (Optional)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## API Key Setup Instructions

### 1. Hugging Face (Primary Choice - Free)
1. Go to https://huggingface.co/
2. Click "Sign Up" and create a free account
3. After signing in, go to Settings → Access Tokens
4. Click "New token"
5. Give it a name like "MiniGPT Image Generation"
6. Select "Read" role
7. Click "Generate token"
8. Copy the token and add it to your `.env.local` file:
   ```env
   HF_API_KEY=hf_your_token_here
   ```

### 2. Google Gemini (For Chat)
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add it to your `.env.local` file

## Priority Order for Image Generation

The system will try image generation APIs in this order:
1. **Hugging Face** (primary choice - free, AI-generated images)
2. **OpenAI DALL-E** (highest quality, AI-generated images)
3. **Stability AI** (high quality, AI-generated images)
4. **Replicate** (multiple models, AI-generated images)
5. **Leonardo AI** (artistic quality, AI-generated images)
6. **Unsplash** (existing images, not AI-generated)
7. **Placeholder** (fallback if no APIs are configured)

## Cost Comparison

| Service | Free Tier | Paid Cost | Quality | Speed |
|---------|-----------|-----------|---------|-------|
| **Hugging Face** | ✅ **Yes** | **Free** | ⭐⭐⭐ | ⭐⭐⭐ |
| OpenAI DALL-E | No | $0.040/image | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Stability AI | 25 images/month | $0.002/image | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Replicate | No | $0.01-0.05/image | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Leonardo AI | No | Credits system | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Unsplash | 50 req/hour | Free | ⭐⭐ | ⭐⭐⭐⭐⭐ |

## Testing Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test chat functionality by typing a message

3. Test image generation by:
   - Typing a prompt like "a beautiful sunset over mountains"
   - Clicking the image generation button
   - You should see an AI-generated image that matches your prompt

## Troubleshooting

### Image Generation Issues
- If you get placeholder images, check that your Hugging Face API key is correctly set
- If you get errors, check the browser console and server logs
- Make sure your API key has the correct format: `hf_` followed by the token

### Chat Issues
- Verify your Gemini API key is correct
- Check that you haven't exceeded the free tier limits

### Hugging Face Specific Issues

#### Rate Limiting
- Free tier has rate limits
- If you get rate limit errors, wait a few minutes and try again
- Check usage at https://huggingface.co/settings/billing

#### Model Loading
- First request might take longer as the model loads
- Subsequent requests will be faster
- If you get model loading errors, the system will automatically retry

#### Token Format
- Make sure your token starts with `hf_`
- Example: `HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Security Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- API keys should be kept secure and not shared publicly
- For production, use environment variables in your hosting platform 