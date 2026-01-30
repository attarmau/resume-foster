import { useLocalStorage } from './useLocalStorage';
import type { ResumeProfile } from '../types';

const INITIAL_RESUME: ResumeProfile = {
    id: 'default',
    basics: {
        name: '',
        email: '',
        phone: '',
        website: '',
        location: '',
        summary: '',
    },
    work: [],
    education: [],
    skills: [],
};

export function useResume() {
    const [resume, setResume] = useLocalStorage<ResumeProfile>('foster_resume', INITIAL_RESUME);

    const updateBasics = (basics: Partial<ResumeProfile['basics']>) => {
        setResume((prev) => ({
            ...prev,
            basics: { ...prev.basics, ...basics },
        }));
    };

    const addWork = () => {
        const newWork = {
            id: crypto.randomUUID(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            highlights: [],
        };
        setResume((prev) => ({
            ...prev,
            work: [newWork, ...prev.work],
        }));
    };

    const updateWork = (id: string, updates: Partial<ResumeProfile['work'][0]>) => {
        setResume((prev) => ({
            ...prev,
            work: prev.work.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        }));
    };

    const removeWork = (id: string) => {
        setResume((prev) => ({
            ...prev,
            work: prev.work.filter((w) => w.id !== id),
        }));
    };

    const addEducation = () => {
        const newEdu = {
            id: crypto.randomUUID(),
            institution: '',
            area: '',
            studyType: '',
            startDate: '',
            endDate: '',
        };
        setResume((prev) => ({
            ...prev,
            education: [newEdu, ...prev.education],
        }));
    };

    const updateEducation = (id: string, updates: Partial<ResumeProfile['education'][0]>) => {
        setResume((prev) => ({
            ...prev,
            education: prev.education.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
    };

    const removeEducation = (id: string) => {
        setResume((prev) => ({
            ...prev,
            education: prev.education.filter((e) => e.id !== id),
        }));
    };

    const updateSkills = (skills: string[]) => {
        setResume((prev) => ({
            ...prev,
            skills,
        }));
    };

    const updateResume = (newResume: ResumeProfile) => {
        setResume(newResume);
    };

    return {
        resume,
        updateBasics,
        addWork,
        updateWork,
        removeWork,
        addEducation,
        updateEducation,
        removeEducation,
        updateSkills,
        updateResume
    };
}
