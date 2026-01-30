import { useResume } from '../../hooks/useResume';
import styles from '../../pages/Resume.module.css';
import { User, Mail, Phone, Globe, MapPin, Briefcase, Plus, Trash2, Calendar } from 'lucide-react';

export default function ResumeEditor() {
    const {
        resume,
        updateBasics,
        addWork,
        updateWork,
        removeWork,
        addEducation,
        updateEducation,
        removeEducation,
        updateSkills
    } = useResume();

    const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateBasics({ [name]: value });
    };

    const IconWrapper = ({ children }: { children: React.ReactNode }) => (
        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', pointerEvents: 'none', display: 'flex' }}>
            {children}
        </div>
    );

    return (
        <div>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <User size={20} />
                    Profile Basics
                </h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <IconWrapper><User size={16} /></IconWrapper>
                            <input
                                className={styles.input}
                                style={{ paddingLeft: '2.5rem' }}
                                name="name"
                                value={resume.basics.name}
                                onChange={handleBasicChange}
                                placeholder="e.g. John Doe"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email (Username)</label>
                        <div style={{ position: 'relative' }}>
                            <IconWrapper><Mail size={16} /></IconWrapper>
                            <input
                                className={styles.input}
                                style={{ paddingLeft: '2.5rem' }}
                                name="email"
                                value={resume.basics.email}
                                onChange={handleBasicChange}
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Phone</label>
                        <div style={{ position: 'relative' }}>
                            <IconWrapper><Phone size={16} /></IconWrapper>
                            <input
                                className={styles.input}
                                style={{ paddingLeft: '2.5rem' }}
                                name="phone"
                                value={resume.basics.phone}
                                onChange={handleBasicChange}
                                placeholder="+1 555 000 0000"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Location</label>
                        <div style={{ position: 'relative' }}>
                            <IconWrapper><MapPin size={16} /></IconWrapper>
                            <input
                                className={styles.input}
                                style={{ paddingLeft: '2.5rem' }}
                                name="location"
                                value={resume.basics.location}
                                onChange={handleBasicChange}
                                placeholder="New York, NY"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Portfolio Website</label>
                        <div style={{ position: 'relative' }}>
                            <IconWrapper><Globe size={16} /></IconWrapper>
                            <input
                                className={styles.input}
                                style={{ paddingLeft: '2.5rem' }}
                                name="website"
                                value={resume.basics.website}
                                onChange={handleBasicChange}
                                placeholder="https://johndoe.com"
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                    <label className={styles.label}>Summary / Bio</label>
                    <textarea
                        className={styles.textarea}
                        name="summary"
                        value={resume.basics.summary}
                        onChange={handleBasicChange}
                        placeholder="Brief professional summary..."
                    />
                </div>
            </section>

            {/* Work Experience Section */}
            <section className={styles.section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                        <Briefcase size={20} />
                        Work Experience
                    </h2>
                    <button
                        onClick={addWork}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1rem', background: 'hsla(var(--primary), 0.1)',
                            color: 'hsl(var(--primary))', borderRadius: 'var(--radius)',
                            fontSize: '0.875rem', fontWeight: 600, border: 'none'
                        }}
                    >
                        <Plus size={16} /> Add Position
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {resume.work.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--muted-foreground))', border: '1px dashed hsl(var(--border))', borderRadius: 'var(--radius)' }}>
                            No work experience added yet. Click "Add Position" to start.
                        </div>
                    )}

                    {resume.work.map((work) => (
                        <div key={work.id} style={{
                            padding: '1.5rem',
                            backgroundColor: 'hsl(var(--background))',
                            borderRadius: 'var(--radius)',
                            border: '1px solid hsl(var(--border))',
                            position: 'relative'
                        }}>
                            <button
                                onClick={() => removeWork(work.id)}
                                style={{
                                    position: 'absolute', top: '1rem', right: '1rem',
                                    background: 'none', border: 'none', color: 'hsl(var(--destructive))',
                                    padding: '0.5rem', cursor: 'pointer', opacity: 0.7
                                }}
                                title="Remove Position"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Company</label>
                                    <input
                                        className={styles.input}
                                        value={work.company}
                                        onChange={(e) => updateWork(work.id, { company: e.target.value })}
                                        placeholder="Company Name"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Position</label>
                                    <input
                                        className={styles.input}
                                        value={work.position}
                                        onChange={(e) => updateWork(work.id, { position: e.target.value })}
                                        placeholder="Job Title"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Start Date</label>
                                    <div style={{ position: 'relative' }}>
                                        <IconWrapper><Calendar size={16} /></IconWrapper>
                                        <input
                                            className={styles.input}
                                            style={{ paddingLeft: '2.5rem' }}
                                            value={work.startDate}
                                            onChange={(e) => updateWork(work.id, { startDate: e.target.value })}
                                            placeholder="MM/YYYY"
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>End Date</label>
                                    <div style={{ position: 'relative' }}>
                                        <IconWrapper><Calendar size={16} /></IconWrapper>
                                        <input
                                            className={styles.input}
                                            style={{ paddingLeft: '2.5rem' }}
                                            value={work.endDate}
                                            onChange={(e) => updateWork(work.id, { endDate: e.target.value })}
                                            placeholder="MM/YYYY or Present"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                                <label className={styles.label}>Highlights / Description</label>
                                <textarea
                                    className={styles.textarea}
                                    value={work.highlights.join('\n')}
                                    onChange={(e) => updateWork(work.id, { highlights: e.target.value.split('\n') })}
                                    placeholder="• Key responsibility...&#10;• Achievement..."
                                    style={{ minHeight: '120px' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education Section */}
            <section className={styles.section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                            Education
                        </div>
                    </h2>
                    <button
                        onClick={addEducation}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1rem', background: 'hsla(var(--primary), 0.1)',
                            color: 'hsl(var(--primary))', borderRadius: 'var(--radius)',
                            fontSize: '0.875rem', fontWeight: 600, border: 'none'
                        }}
                    >
                        <Plus size={16} /> Add Education
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {resume.education.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--muted-foreground))', border: '1px dashed hsl(var(--border))', borderRadius: 'var(--radius)' }}>
                            No education added yet.
                        </div>
                    )}

                    {resume.education.map((edu) => (
                        <div key={edu.id} style={{
                            padding: '1.5rem',
                            backgroundColor: 'hsl(var(--background))',
                            borderRadius: 'var(--radius)',
                            border: '1px solid hsl(var(--border))',
                            position: 'relative'
                        }}>
                            <button
                                onClick={() => removeEducation(edu.id)}
                                style={{
                                    position: 'absolute', top: '1rem', right: '1rem',
                                    background: 'none', border: 'none', color: 'hsl(var(--destructive))',
                                    padding: '0.5rem', cursor: 'pointer', opacity: 0.7
                                }}
                                title="Remove Education"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Institution</label>
                                    <input
                                        className={styles.input}
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                                        placeholder="University / College"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Degree / Study Type</label>
                                    <input
                                        className={styles.input}
                                        value={edu.studyType}
                                        onChange={(e) => updateEducation(edu.id, { studyType: e.target.value })}
                                        placeholder="Bachelor's, Master's, etc."
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Area of Study</label>
                                    <input
                                        className={styles.input}
                                        value={edu.area}
                                        onChange={(e) => updateEducation(edu.id, { area: e.target.value })}
                                        placeholder="Computer Science"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label className={styles.label}>Start Year</label>
                                            <input
                                                className={styles.input}
                                                value={edu.startDate}
                                                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                                                placeholder="YYYY"
                                            />
                                        </div>
                                        <div>
                                            <label className={styles.label}>End Year</label>
                                            <input
                                                className={styles.input}
                                                value={edu.endDate}
                                                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                                                placeholder="YYYY"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        Skills
                    </div>
                </h2>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Add Skills (comma separated)</label>
                    <textarea
                        className={styles.textarea}
                        value={resume.skills.join(', ')}
                        onChange={(e) => {
                            const val = e.target.value;
                            // Update as string array, handling empty case
                            updateSkills(val ? val.split(',').map(s => s.trim()) : []);
                        }}
                        placeholder="React, TypeScript, Node.js, Python, AWS..."
                        style={{ minHeight: '80px' }}
                    />
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {resume.skills.filter(s => s).map((skill, i) => (
                            <span key={i} style={{
                                background: 'hsl(var(--secondary))',
                                color: 'hsl(var(--secondary-foreground))',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
