import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate response from Gemini
    const response = await generateText(message);

    return NextResponse.json({
      response,
      conversationId: conversationId || Date.now().toString(),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        conversationId: Date.now().toString()
      },
      { status: 200 }
    );
  }
} 