import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface DoubtSolverProps {
  reviewTopics: string[];
  setReviewTopics: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DoubtSolver: React.FC<DoubtSolverProps> = ({ reviewTopics, setReviewTopics }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
          systemInstruction: 'You are a friendly and patient tutor. Explain complex concepts step-by-step in a way that is easy to understand. Use analogies and examples where possible. Respond in plain text.',
        },
      });
    } catch (e) {
        console.error("Failed to initialize chat", e);
        setError("Failed to initialize the chat session. Please check your API key and refresh.");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !chatRef.current) return;
    
    const userMessage: Message = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await chatRef.current.sendMessage({ message: messageText });
      const aiMessage: Message = { sender: 'ai', text: response.text };
      setMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      setError(errorMessage);
      setMessages(prev => [...prev, { sender: 'ai', text: errorMessage}]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleTopicClick = (topic: string) => {
    const prompt = `Can you please explain "${topic}" in more detail?`;
    sendMessage(prompt);
    setReviewTopics(prev => prev.filter(t => t !== topic));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage(input);
    }
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <h2 className="text-3xl font-bold mb-6">Doubt Solver</h2>

      {reviewTopics.length > 0 && (
        <div className="mb-4 p-4 bg-card border border-border rounded-lg animate-fade-in">
          <h3 className="text-lg font-semibold mb-2 text-text-primary">Topics to Review:</h3>
          <div className="flex flex-wrap gap-2">
            {reviewTopics.map(topic => (
              <button
                key={topic}
                onClick={() => handleTopicClick(topic)}
                className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 bg-card border border-border rounded-lg p-4 flex flex-col overflow-y-auto">
        <div className="flex-1 space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-text-secondary h-full flex items-center justify-center">
              <p>Ask me anything about your studies, or select a topic to review!</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xl lg:max-w-2xl px-4 py-2 rounded-lg ${
                  msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background text-text-primary'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-lg px-4 py-2 rounded-lg bg-background text-text-primary">
                <p>Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-auto flex items-center">
          <input
            type="text"
            className="flex-1 p-3 bg-background border border-border rounded-l-md focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-r-md hover:bg-secondary transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};