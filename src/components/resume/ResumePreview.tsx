import { useResume } from '../../hooks/useResume';
import styles from '../../pages/Resume.module.css';
import { Copy, Check, Briefcase } from 'lucide-react';
import { useState } from 'react';

const CopyRow = ({ label, value }: { label: string, value: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!value) return null;

    return (
        <div className={styles.copyRow}>
            <div style={{ flex: 1, paddingRight: '1rem' }}>
                <div className={styles.copyLabel}>{label}</div>
                <div className={styles.copyValue} style={{ whiteSpace: 'pre-wrap' }}>{value}</div>
            </div>
            <button className={styles.copyButton} onClick={handleCopy} title="Copy to clipboard">
                {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
        </div>
    );
};

export default function ResumePreview() {
    const { resume } = useResume();

    return (
        <div>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Quick Copy Details</h2>
                <div className={styles.label} style={{ marginBottom: '1rem' }}>
                    Basics
                </div>

                <CopyRow label="Full Name" value={resume.basics.name} />
                <CopyRow label="Email" value={resume.basics.email} />
                <CopyRow label="Phone" value={resume.basics.phone} />
                <CopyRow label="Location" value={resume.basics.location} />
                <CopyRow label="Website" value={resume.basics.website} />
                <CopyRow label="Summary" value={resume.basics.summary} />
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Briefcase size={20} />
                    Work Experience
                </h2>
                {resume.work.length === 0 && (
                    <div style={{ color: 'hsl(var(--muted-foreground))' }}>No work experience to display.</div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {resume.work.map((work, index) => (
                        <div key={work.id}>
                            <div style={{
                                fontSize: '0.875rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))',
                                marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                                Position {index + 1}: {work.company || 'Untitled'}
                            </div>

                            <div style={{ paddingLeft: '1rem', borderLeft: '2px solid hsl(var(--border))' }}>
                                <CopyRow label="Company" value={work.company} />
                                <CopyRow label="Position" value={work.position} />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}><CopyRow label="Start Date" value={work.startDate} /></div>
                                    <div style={{ flex: 1 }}><CopyRow label="End Date" value={work.endDate} /></div>
                                </div>
                                <CopyRow label="Highlights / Description" value={work.highlights.join('\n')} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Education</h2>
                {resume.education.length === 0 && (
                    <div style={{ color: 'hsl(var(--muted-foreground))' }}>No education to display.</div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {resume.education.map((edu) => (
                        <div key={edu.id}>
                            <div style={{ paddingLeft: '1rem', borderLeft: '2px solid hsl(var(--border))' }}>
                                <CopyRow label="Institution" value={edu.institution} />
                                <CopyRow label="Degree" value={edu.studyType} />
                                <CopyRow label="Area of Study" value={edu.area} />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}><CopyRow label="Start Date" value={edu.startDate} /></div>
                                    <div style={{ flex: 1 }}><CopyRow label="End Date" value={edu.endDate} /></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Skills</h2>
                {resume.skills.length === 0 ? (
                    <div style={{ color: 'hsl(var(--muted-foreground))' }}>No skills to display.</div>
                ) : (
                    <div>
                        <CopyRow label="All Skills" value={resume.skills.join(', ')} />
                        {/* Optional: Break down by category if we had categories, for now just bulk copy is most useful */}
                    </div>
                )}
            </section>
        </div>
    );
}
