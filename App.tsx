import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Summarizer } from './components/Summarizer';
import { FlashcardGenerator } from './components/FlashcardGenerator';
import { StudyPlanner } from './components/StudyPlanner';
import { DoubtSolver } from './components/DoubtSolver';
import type { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [reviewTopics, setReviewTopics] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const addReviewTopics = (topics: string[]) => {
    setReviewTopics(prevTopics => {
      // Use a Set to easily filter out duplicates
      const allTopics = new Set([...prevTopics, ...topics]);
      return Array.from(allTopics);
    });
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'summarizer':
        return <Summarizer />;
      case 'flashcards':
        return <FlashcardGenerator addReviewTopics={addReviewTopics} />;
      case 'planner':
        return <StudyPlanner />;
      case 'doubts':
        return <DoubtSolver reviewTopics={reviewTopics} setReviewTopics={setReviewTopics} />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-primary font-sans overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1.9c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm-1.8 14.9l-4-4.2 1.4-1.4 2.6 2.8 5.6-6.6 1.4 1.4-7 8z" />
            </svg>
            <h1 className="text-xl font-bold ml-2 text-text-primary">StudyMind Ai</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-1">
            <svg className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
