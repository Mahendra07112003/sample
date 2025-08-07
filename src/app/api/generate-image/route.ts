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

    // Option 1: Hugging Face Inference API (Primary Choice - Free)
    const HF_API_KEY = process.env.HF_API_KEY;
    console.log('Hugging Face API key available:', !!HF_API_KEY);
    
    if (HF_API_KEY) {
      try {
        console.log('Attempting to generate image with Hugging Face');
        const response = await fetch(
          'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${HF_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: prompt })
          }
        );
        
        console.log('Hugging Face API response status:', response.status);
        
        if (response.ok) {
          const imageBuffer = await response.arrayBuffer();
          const base64 = Buffer.from(imageBuffer).toString('base64');
          const imageUrl = `data:image/png;base64,${base64}`;
          
          console.log('Returning Hugging Face generated image');
          return NextResponse.json({
            imageUrl,
            prompt,
            message: 'Image generated successfully using Hugging Face'
          });
        } else {
          console.error('Hugging Face API error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Hugging Face API error:', error);
      }
    }

    // Option 2: OpenAI DALL-E (High quality, paid)
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    console.log('OpenAI API key available:', !!OPENAI_API_KEY);
    
    if (OPENAI_API_KEY) {
      try {
        console.log('Attempting to generate image with OpenAI DALL-E');
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url'
          })
        });
        
        console.log('OpenAI API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('OpenAI API data received');
          
          if (data.data && data.data.length > 0) {
            console.log('Returning OpenAI generated image');
            return NextResponse.json({
              imageUrl: data.data[0].url,
              prompt,
              message: 'Image generated successfully using OpenAI DALL-E'
            });
          }
        } else {
          console.error('OpenAI API error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('OpenAI API error:', error);
      }
    }

    // Option 3: Stability AI (Free tier available)
    const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
    console.log('Stability API key available:', !!STABILITY_API_KEY);
    
    if (STABILITY_API_KEY) {
      try {
        console.log('Attempting to generate image with Stable Diffusion');
        const response = await fetch(
          'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${STABILITY_API_KEY}`,
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              text_prompts: [
                {
                  text: prompt,
                  weight: 1
                }
              ],
              cfg_scale: 7,
              height: 1024,
              width: 1024,
              samples: 1,
              steps: 30,
            })
          }
        );
        
        console.log('Stability API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Stability API data received');
          
          if (data.artifacts && data.artifacts.length > 0) {
            // Convert base64 to data URL
            const imageData = data.artifacts[0];
            const imageUrl = `data:image/png;base64,${imageData.base64}`;
            
            console.log('Returning generated image');
            return NextResponse.json({
              imageUrl,
              prompt,
              message: 'Image generated successfully using Stable Diffusion'
            });
          }
        } else {
          console.error('Stability API error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Stability API error:', error);
      }
    }

    // Option 4: Replicate (Multiple models available)
    const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
    console.log('Replicate API key available:', !!REPLICATE_API_KEY);
    
    if (REPLICATE_API_KEY) {
      try {
        console.log('Attempting to generate image with Replicate');
        const response = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${REPLICATE_API_KEY}`
          },
          body: JSON.stringify({
            version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            input: {
              prompt: prompt,
              width: 1024,
              height: 1024,
              num_outputs: 1,
              scheduler: "K_EULER",
              num_inference_steps: 50,
              guidance_scale: 7.5,
              seed: Math.floor(Math.random() * 1000000)
            }
          })
        });
        
        console.log('Replicate API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Replicate prediction started:', data.id);
          
          // Poll for completion
          let attempts = 0;
          const maxAttempts = 30;
          
          while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            
            const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
              headers: {
                'Authorization': `Token ${REPLICATE_API_KEY}`
              }
            });
            
            if (statusResponse.ok) {
              const statusData = await statusResponse.json();
              
              if (statusData.status === 'succeeded' && statusData.output && statusData.output.length > 0) {
                console.log('Returning Replicate generated image');
                return NextResponse.json({
                  imageUrl: statusData.output[0],
                  prompt,
                  message: 'Image generated successfully using Replicate'
                });
              } else if (statusData.status === 'failed') {
                console.error('Replicate prediction failed:', statusData.error);
                break;
              }
            }
            
            attempts++;
          }
        } else {
          console.error('Replicate API error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Replicate API error:', error);
      }
    }

    // Option 5: Leonardo AI (High quality)
    const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
    console.log('Leonardo API key available:', !!LEONARDO_API_KEY);
    
    if (LEONARDO_API_KEY) {
      try {
        console.log('Attempting to generate image with Leonardo AI');
        const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LEONARDO_API_KEY}`
          },
          body: JSON.stringify({
            prompt: prompt,
            modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3", // Leonardo Creative
            width: 1024,
            height: 1024,
            num_images: 1,
            photoReal: false,
            guidanceScale: 7,
            num_inference_steps: 50
          })
        });
        
        console.log('Leonardo API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Leonardo generation started:', data.sdGenerationJob.generationId);
          
          // Poll for completion
          let attempts = 0;
          const maxAttempts = 30;
          
          while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
            
            const statusResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generation/${data.sdGenerationJob.generationId}`, {
              headers: {
                'Authorization': `Bearer ${LEONARDO_API_KEY}`
              }
            });
            
            if (statusResponse.ok) {
              const statusData = await statusResponse.json();
              
              if (statusData.generations_by_pk.status === 'COMPLETE' && statusData.generations_by_pk.generated_images && statusData.generations_by_pk.generated_images.length > 0) {
                console.log('Returning Leonardo generated image');
                return NextResponse.json({
                  imageUrl: statusData.generations_by_pk.generated_images[0].url,
                  prompt,
                  message: 'Image generated successfully using Leonardo AI'
                });
              } else if (statusData.generations_by_pk.status === 'FAILED') {
                console.error('Leonardo generation failed');
                break;
              }
            }
            
            attempts++;
          }
        } else {
          console.error('Leonardo API error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Leonardo API error:', error);
      }
    }

    // Option 6: Use Unsplash API as fallback (existing images)
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    console.log('Unsplash API key available:', !!UNSPLASH_ACCESS_KEY);
    
    if (UNSPLASH_ACCESS_KEY) {
      try {
        console.log('Attempting to fetch from Unsplash API as fallback');
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
            console.log('Returning Unsplash image as fallback');
            return NextResponse.json({
              imageUrl: data.results[0].urls.regular,
              prompt,
              message: 'Image found using Unsplash (not AI generated)'
            });
          }
        }
      } catch (error) {
        console.error('Unsplash API error:', error);
      }
    }

    // Option 7: Use a placeholder service (final fallback)
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