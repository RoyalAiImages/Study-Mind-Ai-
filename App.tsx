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
    <div className="flex h-screen bg-background text-text-primary font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;