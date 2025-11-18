export type View = 'dashboard' | 'summarizer' | 'flashcards' | 'planner' | 'doubts';

export interface Flashcard {
  question: string;
  answer: string;
}
