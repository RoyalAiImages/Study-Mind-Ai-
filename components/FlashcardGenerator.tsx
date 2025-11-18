import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Flashcard } from '../types';

// Utility to convert file to base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

interface FlashcardGeneratorProps {
  addReviewTopics: (topics: string[]) => void;
}

export const FlashcardGenerator: React.FC<FlashcardGeneratorProps> = ({ addReviewTopics }) => {
  const [sourceText, setSourceText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [flipped, setFlipped] = useState<number | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setSourceText(''); // Clear text if a file is selected
    }
  };

  const generateFlashcards = useCallback(async () => {
    if (!sourceText && !file) {
      setError('Please provide some text or a file to generate flashcards from.');
      return;
    }
    setError('');
    setIsLoading(true);
    setFlashcards([]);
    setSelectedCards(new Set());

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';
      
      const instruction = `Based on the following content, generate a set of flashcards. Each flashcard should have a 'question' (a term or concept) and an 'answer' (its definition or explanation). Provide at least 5 flashcards if possible.`;
      
      const contentPart = file 
        ? await fileToGenerativePart(file) 
        : { text: sourceText };
        
      const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: instruction }, contentPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
              },
              required: ['question', 'answer'],
            },
          },
        },
      });

      const parsedFlashcards = JSON.parse(response.text);
      setFlashcards(parsedFlashcards);

    } catch (e) {
      console.error(e);
      setError('Failed to generate flashcards. The content might be too short or complex. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, file]);

  const handleFlip = (index: number) => {
    setFlipped(flipped === index ? null : index);
  };

  const handleSelectCard = (index: number) => {
    setSelectedCards(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(index)) {
        newSelection.delete(index);
      } else {
        newSelection.add(index);
      }
      return newSelection;
    });
  };

  const handleAddToReview = () => {
    const topics = Array.from(selectedCards).map(index => flashcards[index].question);
    addReviewTopics(topics);
    setSelectedCards(new Set());
    // Optionally: add a success notification here
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6">Flashcard Generator</h2>
      <div className="bg-card p-6 rounded-lg border border-border">
        <p className="text-text-secondary mb-4">
          Paste your notes or upload a document to automatically create flashcards.
        </p>
        <textarea
          className="w-full h-48 p-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Paste your text here..."
          value={sourceText}
          onChange={(e) => {
            setSourceText(e.target.value)
            if (file) setFile(null); // Clear file if text is entered
          }}
          disabled={isLoading}
        />
        <div className="my-4 text-center text-text-secondary">OR</div>
        <input
          type="file"
          className="w-full p-2 bg-background border border-border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-secondary"
          onChange={handleFileChange}
          accept="image/*,application/pdf,.txt"
          disabled={isLoading}
        />
        {file && <p className="text-sm text-text-secondary mt-2">Selected file: {file.name}</p>}

        <button
          onClick={generateFlashcards}
          disabled={isLoading || (!sourceText && !file)}
          className="mt-6 w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-md hover:bg-secondary transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
           {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Create Flashcards'
          )}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {flashcards.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Your Flashcards</h3>
            <button
              onClick={handleAddToReview}
              disabled={selectedCards.size === 0}
              className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add {selectedCards.size > 0 ? selectedCards.size : ''} to Review
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcards.map((card, index) => (
              <div key={index} className="relative group">
                <div 
                  className="perspective-1000" 
                  onClick={() => handleFlip(index)} 
                  role="button" 
                  tabIndex={0} 
                  onKeyPress={(e) => e.key === 'Enter' && handleFlip(index)}
                >
                  <div 
                    className={`relative w-full h-64 rounded-lg shadow-lg transform-style-3d transition-transform duration-500 ${flipped === index ? 'rotate-y-180' : ''}`}
                  >
                    {/* Front of card */}
                    <div className="absolute w-full h-full backface-hidden bg-card border border-border rounded-lg flex items-center justify-center p-4 text-center cursor-pointer">
                      <p className="text-lg font-semibold text-text-primary">{card.question}</p>
                    </div>
                    {/* Back of card */}
                    <div className="absolute w-full h-full backface-hidden bg-primary rotate-y-180 rounded-lg flex items-center justify-center p-4 text-center cursor-pointer">
                      <p className="text-md text-primary-foreground">{card.answer}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectCard(index)}
                  aria-pressed={selectedCards.has(index)}
                  className={`absolute top-3 right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 border-2  
                    ${selectedCards.has(index) ? 'bg-primary border-primary' : 'bg-background/50 border-border group-hover:opacity-100 opacity-0'}`}
                >
                  {selectedCards.has(index) && <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};