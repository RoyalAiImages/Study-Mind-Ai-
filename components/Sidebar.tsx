import React from 'react';
import type { View } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, activeView, setActiveView, icon, label }) => (
  <button
    onClick={() => setActiveView(view)}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
      activeView === view
        ? 'bg-primary text-primary-foreground'
        : 'text-text-secondary hover:bg-card hover:text-text-primary'
    }`}
    aria-current={activeView === view ? 'page' : undefined}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isSidebarOpen, setIsSidebarOpen }) => {
  const handleNavigation = (view: View) => {
    setActiveView(view);
    setIsSidebarOpen(false); // Close sidebar after navigation on mobile
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />
      
      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 w-56 bg-background p-4 border-r border-border flex flex-col z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden md:flex items-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.9c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm-1.8 14.9l-4-4.2 1.4-1.4 2.6 2.8 5.6-6.6 1.4 1.4-7 8z" />
          </svg>
          <h1 className="text-xl font-bold ml-2 text-text-primary">StudyMind Ai</h1>
        </div>

        {/* Spacer for mobile to clear the header */}
        <div className="h-16 md:hidden" />

        <nav className="flex flex-col space-y-2">
          <NavItem
            view="dashboard"
            activeView={activeView}
            setActiveView={handleNavigation}
            icon={<DashboardIcon />}
            label="Dashboard"
          />
          <NavItem
            view="summarizer"
            activeView={activeView}
            setActiveView={handleNavigation}
            icon={<SummarizerIcon />}
            label="Summarizer"
          />
          <NavItem
            view="flashcards"
            activeView={activeView}
            setActiveView={handleNavigation}
            icon={<FlashcardsIcon />}
            label="Flashcards"
          />
          <NavItem
            view="planner"
            activeView={activeView}
            setActiveView={handleNavigation}
            icon={<PlannerIcon />}
            label="Study Planner"
          />
          <NavItem
            view="doubts"
            activeView={activeView}
            setActiveView={handleNavigation}
            icon={<DoubtsIcon />}
            label="Doubt Solver"
          />
        </nav>
      </aside>
    </>
  );
};

// SVG Icons
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const SummarizerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const FlashcardsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2M5 11H3" /></svg>;
const PlannerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const DoubtsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
