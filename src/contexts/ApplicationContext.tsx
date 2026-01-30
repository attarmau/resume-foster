import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { JobApplication } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ApplicationContextType {
    applications: JobApplication[];
    addApplication: (app: Omit<JobApplication, 'id' | 'dateApplied'>) => void;
    updateApplication: (id: string, updates: Partial<JobApplication>) => void;
    deleteApplication: (id: string) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: ReactNode }) {
    const [applications, setApplications] = useLocalStorage<JobApplication[]>('foster_applications', []);

    const addApplication = (app: Omit<JobApplication, 'id' | 'dateApplied'>) => {
        const newApp: JobApplication = {
            ...app,
            id: uuidv4(),
            dateApplied: new Date().toISOString(),
        };
        setApplications((prev) => [newApp, ...prev]);
    };

    const updateApplication = (id: string, updates: Partial<JobApplication>) => {
        setApplications((prev) =>
            prev.map(app => app.id === id ? { ...app, ...updates } : app)
        );
    };

    const deleteApplication = (id: string) => {
        setApplications((prev) => prev.filter(app => app.id !== id));
    };

    return (
        <ApplicationContext.Provider value={{ applications, addApplication, updateApplication, deleteApplication }}>
            {children}
        </ApplicationContext.Provider>
    );
}

export function useApplicationContext() {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
        throw new Error('useApplicationContext must be used within an ApplicationProvider');
    }
    return context;
}
