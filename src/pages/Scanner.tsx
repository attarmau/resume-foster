import { useState } from 'react';
import styles from './Scanner.module.css';
import { useResumes } from '../hooks/useResumes';
import type { ScanResult } from '../utils/ats';
import { analyzeMatch } from '../utils/ats';
import { extractTextFromPdf } from '../utils/pdf';
import { ScanSearch, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function Scanner() {
    const { resumes } = useResumes();
    const [selectedResumeId, setSelectedResumeId] = useState<string>('');
    const [isExtracting, setIsExtracting] = useState(false);

    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState<ScanResult | null>(null);

    const handleScan = async () => {
        if (!jobDescription.trim()) return;

        // Find selected resume
        const resume = resumes.find(r => r.id === selectedResumeId);
        if (!resume) {
            alert('Please select a resume to scan.');
            return;
        }

        setIsExtracting(true);
        try {
            const text = await extractTextFromPdf(resume.fileUrl);
            const analysis = analyzeMatch(jobDescription, text);
            setResult(analysis);
        } catch (error) {
            console.error(error);
            alert('Failed to read resume PDF. Please try again.');
        } finally {
            setIsExtracting(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>ATS Scanner</h1>
                <p className={styles.subtitle}>Paste a job description to check your resume match score.</p>
            </header>

            <div className={styles.grid}>
                {/* Left Panel: Input */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <span>Job Description</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select
                                value={selectedResumeId}
                                onChange={(e) => setSelectedResumeId(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}
                            >
                                <option value="">Select Resume...</option>
                                {resumes.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.role} - {r.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                className={styles.button}
                                onClick={handleScan}
                                disabled={!jobDescription.trim() || !selectedResumeId || isExtracting}
                            >
                                {isExtracting ? <Loader2 className="animate-spin" size={16} /> : 'Scan Now'}
                            </button>
                        </div>
                    </div>
                    <textarea
                        className={styles.textarea}
                        placeholder="Paste the full job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>

                {/* Right Panel: Results */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        Match Analysis
                    </div>

                    {result ? (
                        <>
                            <div className={styles.scoreContainer}>
                                <div className={styles.scoreCircle} style={{ '--percent': `${result.score}%` } as any}>
                                    <div className={styles.scoreInner}>
                                        <span className={styles.scoreValue}>{result.score}%</span>
                                        <span className={styles.scoreLabel}>Match</span>
                                    </div>
                                </div>
                                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>
                                    Based on {result.totalKeywords} significant keywords found in JD.
                                </p>
                            </div>

                            <div className={styles.resultsContent}>
                                <div className={styles.keywordGroup}>
                                    <div className={styles.groupTitle}>
                                        <AlertCircle size={16} color="hsl(var(--destructive))" />
                                        Missing Keywords ({result.missingKeywords.length})
                                    </div>
                                    <div className={styles.tags}>
                                        {result.missingKeywords.length === 0 ? (
                                            <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>None! Great job coverage.</span>
                                        ) : (
                                            result.missingKeywords.map(word => (
                                                <span key={word} className={`${styles.tag} ${styles.tagMissing}`}>
                                                    {word}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className={styles.keywordGroup}>
                                    <div className={styles.groupTitle}>
                                        <CheckCircle size={16} color="hsl(var(--primary))" />
                                        Matched Keywords ({result.matchedKeywords.length})
                                    </div>
                                    <div className={styles.tags}>
                                        {result.matchedKeywords.length === 0 ? (
                                            <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>No matches found yet.</span>
                                        ) : (
                                            result.matchedKeywords.map(word => (
                                                <span key={word} className={`${styles.tag} ${styles.tagMatched}`}>
                                                    {word}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'hsl(var(--muted-foreground))', gap: '1rem' }}>
                            <ScanSearch size={48} style={{ opacity: 0.2 }} />
                            <p>Ready to analyze. Paste JD and click Scan.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
