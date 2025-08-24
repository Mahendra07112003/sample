'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Plus, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

// Custom Image component with fallback
const ImageWithFallback = ({ src, alt, width, height, className, style }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setUseFallback(false);
  }, [src]);

  if (useFallback) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onError={() => {
          console.error('Fallback image also failed to load:', src);
        }}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={() => {
        console.error('Next.js Image failed to load:', src);
        setUseFallback(true);
      }}
    />
  );
};

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageUrl?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationId: conversationId || Date.now().toString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      if (!conversationId) {
        setConversationId(data.conversationId || Date.now().toString());
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setConversationId('');
  };

  const generateImage = async () => {
    if (!input.trim() || isGeneratingImage) return;

    console.log('Starting image generation for prompt:', input);
    setIsGeneratingImage(true);
    try {
      console.log('Making API request to /api/generate-image');
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      console.log('API response status:', response.status);
      console.log('API response ok:', response.ok);

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      const imageMessage: Message = {
        id: Date.now().toString(),
        content: `Generated image for: "${input}"`,
        role: 'assistant',
        timestamp: new Date(),
        imageUrl: data.imageUrl,
      };

      console.log('Adding image message to chat:', imageMessage);
      setMessages(prev => [...prev, imageMessage]);
      setInput('');
    } catch (error) {
      console.error('Error generating image:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error generating the image. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* Header */}
      <div className="navbar navbar-dark bg-primary p-3">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <h5 className="text-white mb-0">VisionChat</h5>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={startNewConversation}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto p-3">
        {messages.length === 0 && (
          <div className="text-center text-muted mt-5">
            <Bot size={48} className="mb-3" />
            <h6>Welcome to VisionChat!</h6>
            <p className="small">Start a conversation by typing a message below.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`d-flex mb-3 ${
              message.role === 'user' ? 'justify-content-end' : 'justify-content-start'
            }`}
          >
            <div
              className={`message-bubble p-3 ${
                message.role === 'user' ? 'user-message' : 'assistant-message'
              }`}
            >
              <div className="d-flex align-items-center mb-2">
                {message.role === 'user' ? (
                  <User size={16} className="me-2" />
                ) : (
                  <Bot size={16} className="me-2" />
                )}
                <small className="text-muted">
                  {message.timestamp.toLocaleTimeString()}
                </small>
              </div>
              <div className="message-content">
                {message.role === 'assistant' ? (
                  <>
                    <ReactMarkdown
                      components={{
                        code({ inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={tomorrow as any}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                    {message.imageUrl && (
                      <div className="mt-3">
                        <ImageWithFallback 
                          src={message.imageUrl} 
                          alt="Generated" 
                          width={400}
                          height={300}
                          className="img-fluid rounded"
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div>{message.content}</div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="d-flex justify-content-start mb-3">
            <div className="message-bubble assistant-message p-3">
              <div className="d-flex align-items-center">
                <Bot size={16} className="me-2" />
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isGeneratingImage && (
          <div className="d-flex justify-content-start mb-3">
            <div className="message-bubble assistant-message p-3">
              <div className="d-flex align-items-center">
                <ImageIcon size={16} className="me-2" />
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <small className="text-muted ms-2">Generating image...</small>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-top bg-white p-3">
        <div className="input-group">
          <textarea
            className="form-control"
            placeholder="Type your message or image prompt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            style={{ resize: 'none' }}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={generateImage}
            disabled={isGeneratingImage || !input.trim()}
            title="Generate Image"
          >
            {isGeneratingImage ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <ImageIcon size={16} />
            )}
          </button>
          <button
            className="btn btn-primary"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
} 
