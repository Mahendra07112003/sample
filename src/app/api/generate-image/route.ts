import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Image generation request received');
    const { prompt } = await request.json();
    console.log('Prompt received:', prompt);

    if (!prompt) {
      console.log('No prompt provided');
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Option 1: Use Unsplash API for free image generation
    // You can get a free API key from https://unsplash.com/developers
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    console.log('Unsplash API key available:', !!UNSPLASH_ACCESS_KEY);
    
    if (UNSPLASH_ACCESS_KEY) {
      try {
        console.log('Attempting to fetch from Unsplash API');
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=1`,
          {
            headers: {
              'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
          }
        );
        
        console.log('Unsplash API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Unsplash API data received:', data);
          if (data.results && data.results.length > 0) {
            console.log('Returning Unsplash image');
            return NextResponse.json({
              imageUrl: data.results[0].urls.regular,
              prompt,
              message: 'Image generated successfully using Unsplash'
            });
          }
        }
      } catch (error) {
        console.error('Unsplash API error:', error);
      }
    }

    // Option 2: Use a free placeholder service (fallback)
    // For a real implementation, you could also use:
    // - Stable Diffusion API (free tier available)
    // - Hugging Face Inference API (free tier available)
    // - Replicate API (free tier available)
    
    const imageUrl = `https://via.placeholder.com/512x512/007bff/ffffff?text=${encodeURIComponent(prompt)}`;
    console.log('Returning placeholder image URL:', imageUrl);

    return NextResponse.json({
      imageUrl,
      prompt,
      message: 'Image generated successfully (placeholder)'
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 