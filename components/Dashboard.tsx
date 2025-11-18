import React from 'react';
import type { View } from '../types';

interface DashboardProps {
  setActiveView: (view: View) => void;
}

const FeatureCard: React.FC<{
    title: string;
    description: string;
    // Fix: Used React.ReactNode instead of JSX.Element to resolve namespace issue.
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
    <button
        onClick={onClick}
        className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-all duration-300 transform hover:-translate-y-1 text-left"
    >
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 text-primary mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">{description}</p>
    </button>
);

export const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-text-primary">Welcome to StudyMind Ai</h1>
        <p className="text-lg text-text-secondary mt-2">Your AI-powered study assistant. Supercharge your learning.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Summarizer"
          description="Convert long lectures, PDFs, and notes into concise summaries instantly."
          icon={<SummarizerIcon />}
          onClick={() => setActiveView('summarizer')}
        />
        <FeatureCard
          title="Flashcard Generator"
          description="Automatically create flashcards from your study materials to ace your exams."
          icon={<FlashcardsIcon />}
          onClick={() => setActiveView('flashcards')}
        />
        <FeatureCard
          title="Study Planner"
          description="Get a personalized study schedule based on your deadlines and subjects."
          icon={<PlannerIcon />}
          onClick={() => setActiveView('planner')}
        />
        <FeatureCard
          title="Doubt Solver"
          description="Get step-by-step explanations for any concept you're struggling with."
          icon={<DoubtsIcon />}
          onClick={() => setActiveView('doubts')}
        />
      </div>
    </div>
  );
};


// Icons (re-used from Sidebar for consistency)
const SummarizerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const FlashcardsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2M5 11H3" /></svg>;
const PlannerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const DoubtsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;