import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

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

export const Summarizer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setInputText(''); // Clear text if a file is selected
    }
  };
  
  const generateSummary = useCallback(async () => {
    if (!inputText && !file) {
      setError('Please provide text or upload a file to summarize.');
      return;
    }
    setError('');
    setIsLoading(true);
    setSummary('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';

      let promptParts: any[] = [{ text: 'Summarize the following content in the style of concise, academic study notes. Use bullet points for key information:' }];

      if (file) {
        const filePart = await fileToGenerativePart(file);
        promptParts.push(filePart);
      } else {
        promptParts.push({ text: inputText });
      }

      const response = await ai.models.generateContent({
        model: model,
        contents: { parts: promptParts },
      });
      
      setSummary(response.text);

    } catch (e) {
      console.error(e);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, file]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6">Content Summarizer</h2>
      <div className="bg-card p-6 rounded-lg border border-border">
        <p className="text-text-secondary mb-4">
          Paste your text below or upload a document/image to get a concise summary.
        </p>
        <textarea
          className="w-full h-40 p-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Paste your text here..."
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
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
          onClick={generateSummary}
          disabled={isLoading || (!inputText && !file)}
          className="mt-6 w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-md hover:bg-secondary transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Summarizing...
            </>
          ) : (
            'Generate Summary'
          )}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {(summary || isLoading) && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Summary</h3>
          <div className="bg-card p-6 rounded-lg border border-border min-h-[200px] whitespace-pre-wrap">
            {isLoading ? <p>Generating your summary...</p> : summary}
          </div>
        </div>
      )}
    </div>
  );
};