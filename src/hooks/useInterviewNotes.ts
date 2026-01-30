import { useLocalStorage } from './useLocalStorage';
import type { InterviewNote } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function useInterviewNotes() {
    const [notes, setNotes] = useLocalStorage<InterviewNote[]>('foster_interview_notes', []);

    const addNote = (note: Omit<InterviewNote, 'id' | 'createdAt'>) => {
        const newNote: InterviewNote = {
            ...note,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
        };
        setNotes((prev) => [newNote, ...prev]);
    };

    const updateNote = (id: string, updates: Partial<InterviewNote>) => {
        setNotes((prev) =>
            prev.map(n => n.id === id ? { ...n, ...updates } : n)
        );
    };

    const deleteNote = (id: string) => {
        setNotes((prev) => prev.filter(n => n.id !== id));
    };

    const getCategories = () => {
        const categories = new Set(notes.map(n => n.category));
        return Array.from(categories).sort();
    };

    return { notes, addNote, updateNote, deleteNote, getCategories };
}
