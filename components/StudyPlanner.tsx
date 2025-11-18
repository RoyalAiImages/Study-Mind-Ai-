import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

export const StudyPlanner: React.FC = () => {
  const [subjects, setSubjects] = useState('');
  const [examDate, setExamDate] = useState('');
  const [studyHours, setStudyHours] = useState('');
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePlan = useCallback(async () => {
    if (!subjects || !examDate || !studyHours) {
      setError('Please fill in all the fields to generate a plan.');
      return;
    }
    setError('');
    setIsLoading(true);
    setPlan('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-pro';
      
      const prompt = `Create a detailed study plan for a student.
        Subjects/Topics: ${subjects}
        Exam Date: ${examDate}
        Daily study hours available: ${studyHours} hours

        The plan should be structured, realistic, and cover all topics. Break it down day-by-day or week-by-week leading up to the exam. Include suggestions for revision and breaks. Present the output as plain text with clear headings and lists.`;
      
      const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
      });

      setPlan(response.text);

    } catch (e) {
      console.error(e);
      setError('Failed to generate study plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [subjects, examDate, studyHours]);
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6">Personalized Study Planner</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-text-secondary mb-4">
            Provide your study details, and our AI will create a custom schedule for you.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="subjects" className="block text-sm font-medium text-text-secondary mb-1">Subjects / Topics</label>
              <input 
                type="text" 
                id="subjects"
                className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="e.g., Calculus, Physics, Data Structures"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="examDate" className="block text-sm font-medium text-text-secondary mb-1">Exam Date</label>
              <input 
                type="date" 
                id="examDate"
                className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="studyHours" className="block text-sm font-medium text-text-secondary mb-1">Daily Study Hours (approx.)</label>
              <input 
                type="number" 
                id="studyHours"
                className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="e.g., 3"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            onClick={generatePlan}
            disabled={isLoading || !subjects || !examDate || !studyHours}
            className="mt-6 w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-md hover:bg-secondary transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
             {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Plan...
                </>
              ) : (
                'Generate Study Plan'
              )}
          </button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-2xl font-bold mb-4">Your Custom Plan</h3>
          <pre className="whitespace-pre-wrap font-sans text-text-secondary">
            {isLoading && <p>Generating your personalized study plan...</p>}
            {plan ? plan : !isLoading && <p>Your plan will appear here.</p>}
          </pre>
        </div>
      </div>
    </div>
  );
};