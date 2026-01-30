import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Resume } from '../types/resume';
import { v4 as uuidv4 } from 'uuid';

interface ResumeContextType {
    resumes: Resume[];
    addResume: (resume: Omit<Resume, 'id' | 'dateUploaded'>) => void;
    deleteResume: (id: string) => void;
    getResumesByRole: (role: string) => Resume[];
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
    const [resumes, setResumes] = useLocalStorage<Resume[]>('foster_resumes', []);

    const addResume = (resume: Omit<Resume, 'id' | 'dateUploaded'>) => {
        const newResume: Resume = {
            ...resume,
            id: uuidv4(),
            dateUploaded: new Date().toISOString(),
        };
        setResumes((prev) => [newResume, ...prev]);
    };

    const deleteResume = (id: string) => {
        setResumes((prev) => prev.filter(r => r.id !== id));
    };

    const getResumesByRole = (role: string) => {
        return resumes.filter(r => r.role === role);
    };

    return (
        <ResumeContext.Provider value={{ resumes, addResume, deleteResume, getResumesByRole }}>
            {children}
        </ResumeContext.Provider>
    );
}

export function useResumeContext() {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResumeContext must be used within a ResumeProvider');
    }
    return context;
}
