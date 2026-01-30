import type { ResumeProfile } from '../types';

// Common stop words to ignore
const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its',
    'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with', 'you', 'your', 'this', 'but', 'or', 'if',
    'we', 'can', 'not', 'have', 'do', 'about', 'most', 'other', 'some', 'these', 'them', 'they', 'our', 'all',
    'into', 'more', 'also', 'any', 'new', 'work', 'what', 'who', 'which', 'when', 'so', 'one', 'use', 'get',
    'how', 'job', 'role', 'team', 'company', 'experience', 'description', 'requirements', 'responsibilities',
    'years', 'ability', 'skills', 'knowledge', 'strong', 'excellent', 'must', 'preferred', 'plus', 'able',
    'looking', 'seeking'
]);

export interface ScanResult {
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    totalKeywords: number;
}

/**
 * Extracts unique significant words from a text string.
 */
function extractKeywords(text: string): Set<string> {
    const normalized = text.toLowerCase().replace(/[^\w\s-]/g, ' '); // Keep hyphens for terms like "back-end"
    const tokens = normalized.split(/\s+/);
    const keywords = new Set<string>();

    tokens.forEach(token => {
        // Only keep tokens longer than 2 chars that aren't stop words and aren't numbers
        if (token.length > 2 && !STOP_WORDS.has(token) && isNaN(Number(token))) {
            keywords.add(token);
        }
    });

    return keywords;
}

/**
 * flattens resume into a single string for analysis
 */
function resumeToString(resume: ResumeProfile): string {
    const parts = [
        resume.basics.summary,
        ...resume.skills,
        ...resume.work.map(w => `${w.company} ${w.position} ${w.highlights.join(' ')}`),
        ...resume.education.map(e => `${e.institution} ${e.area} ${e.studyType}`)
    ];
    return parts.join(' ');
}

export function analyzeMatch(jobDescription: string, resume: ResumeProfile | string): ScanResult {
    const jdKeywords = extractKeywords(jobDescription);

    let resumeText = '';
    if (typeof resume === 'string') {
        resumeText = resume;
    } else {
        resumeText = resumeToString(resume);
    }

    const resumeKeywords = extractKeywords(resumeText); // Extract from resume using same rules

    const matched: string[] = [];
    const missing: string[] = [];

    jdKeywords.forEach(keyword => {
        if (resumeKeywords.has(keyword)) {
            matched.push(keyword);
        } else {
            missing.push(keyword);
        }
    });

    const total = jdKeywords.size;
    const score = total === 0 ? 0 : Math.round((matched.length / total) * 100);

    return {
        score,
        matchedKeywords: matched.sort(),
        missingKeywords: missing.sort(),
        totalKeywords: total
    };
}
