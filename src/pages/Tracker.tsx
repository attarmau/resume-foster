import { useState } from 'react';
import styles from './Tracker.module.css';
import { useApplications } from '../hooks/useApplications';
import type { ApplicationStatus } from '../types';
import { Plus, Briefcase, Calendar, Clock, CheckCircle, XCircle, ChevronDown, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const COLUMNS: { id: ApplicationStatus; label: string; icon: any }[] = [
    { id: 'wishlist', label: 'Wishlist', icon: Briefcase },
    { id: 'applied', label: 'Applied', icon: Clock },
    { id: 'interviewing', label: 'Interviewing', icon: Calendar },
    { id: 'offer', label: 'Offer', icon: CheckCircle },
    { id: 'rejected', label: 'Rejected', icon: XCircle },
];

const INTERVIEW_STAGES = [
    'Recruiter Screen',
    'Technical Screen',
    'Technical Interview',
    'System Design',
    'Behavioral',
    'Final Round'
];

export default function Tracker() {
    const { applications, addApplication, updateApplication, deleteApplication } = useApplications();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    // Group applications by status
    const getAppsByStatus = (status: ApplicationStatus) =>
        applications.filter(app => app.status === status);

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('select') || (e.target as HTMLElement).closest('input')) {
            return;
        }
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Application Tracker</h1>
                <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Add Application
                </button>
            </header>

            <div className={styles.board}>
                {COLUMNS.map(col => {
                    const apps = getAppsByStatus(col.id);
                    const Icon = col.icon;
                    return (
                        <div
                            key={col.id}
                            className={`${styles.column} ${draggedId ? styles.columnDropZone : ''}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const appId = e.dataTransfer.getData('applicationId');
                                if (appId) {
                                    updateApplication(appId, { status: col.id });
                                    setDraggedId(null);
                                }
                            }}
                        >
                            <div className={styles.columnHeader}>
                                <div className={styles.columnTitle}>
                                    <Icon size={16} />
                                    {col.label}
                                </div>
                                <div className={styles.countBadge}>{apps.length}</div>
                            </div>
                            <div className={styles.columnContent}>
                                {apps.map(app => {
                                    const isExpanded = expandedId === app.id;
                                    return (
                                        <div
                                            key={app.id}
                                            className={`${styles.card} ${isExpanded ? styles.cardExpanded : ''}`}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('applicationId', app.id);
                                                setDraggedId(app.id);
                                            }}
                                            onDragEnd={() => setDraggedId(null)}
                                            onClick={(e) => toggleExpand(app.id, e)}
                                        >
                                            <button
                                                className={styles.deleteButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Delete this application?')) {
                                                        deleteApplication(app.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                            <div className={styles.cardHeader}>
                                                <div className={styles.cardCompany}>{app.company}</div>
                                                <div className={styles.cardRole}>{app.role}</div>
                                                {!isExpanded && (
                                                    <ChevronDown
                                                        size={14}
                                                        className={styles.expandIcon}
                                                        style={{ opacity: 0, position: 'absolute', right: '0.5rem', bottom: '0.5rem', transition: 'all 0.2s' }}
                                                    />
                                                )}
                                            </div>

                                            {isExpanded && (
                                                <div className={styles.cardDetails}>
                                                    <div className={styles.cardDate}>
                                                        <Calendar size={12} />
                                                        {app.dateApplied && !isNaN(new Date(app.dateApplied).getTime())
                                                            ? format(new Date(app.dateApplied), 'MMM d, yyyy')
                                                            : 'No date'}
                                                    </div>

                                                    {/* Interview Stage Badge & Date */}
                                                    {app.status === 'interviewing' && (
                                                        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                            <select
                                                                className={styles.stageBadge}
                                                                value={app.interviewStage || ''}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) => updateApplication(app.id, { interviewStage: e.target.value })}
                                                                style={{ border: 'none', background: 'hsla(var(--primary), 0.1)', outline: 'none', cursor: 'pointer', maxWidth: '100%' }}
                                                            >
                                                                <option value="" disabled>Set Stage</option>
                                                                {INTERVIEW_STAGES.map(stage => (
                                                                    <option key={stage} value={stage}>{stage}</option>
                                                                ))}
                                                            </select>

                                                            <div style={{ position: 'relative', width: 'fit-content' }}>
                                                                <input
                                                                    type="date"
                                                                    className={styles.stageBadge}
                                                                    style={{
                                                                        background: 'transparent',
                                                                        border: '1px solid hsla(var(--muted-foreground), 0.2)',
                                                                        color: 'hsl(var(--muted-foreground))',
                                                                        width: 'fit-content',
                                                                        paddingLeft: '2rem'
                                                                    }}
                                                                    value={app.interviewDate || ''}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onChange={(e) => updateApplication(app.id, { interviewDate: e.target.value })}
                                                                />
                                                                <Calendar
                                                                    size={12}
                                                                    style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', pointerEvents: 'none' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Basic Status Select */}
                                                    <div style={{ marginTop: '0.75rem' }}>
                                                        <select
                                                            value={app.status}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={(e) => updateApplication(app.id, { status: e.target.value as ApplicationStatus })}
                                                            style={{ fontSize: '0.75rem', padding: '0.25rem', borderRadius: '4px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--muted-foreground))', width: '100%' }}
                                                        >
                                                            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <ApplicationModal
                    onClose={() => setIsModalOpen(false)}
                    onAdd={(app) => {
                        addApplication(app);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}

function ApplicationModal({ onClose, onAdd }: { onClose: () => void, onAdd: (app: any) => void }) {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        link: '',
        status: 'applied',
        interviewStage: undefined,
        interviewDate: '',
        notes: ' '
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>Track New Job</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Company</label>
                        <input
                            required
                            autoFocus
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Role</label>
                        <input
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Status</label>
                        <select
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                    </div>

                    {formData.status === 'interviewing' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Stage</label>
                                <select
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                                    value={formData.interviewStage || ''}
                                    onChange={e => setFormData({ ...formData, interviewStage: e.target.value as any })}
                                >
                                    <option value="" disabled>Select Stage</option>
                                    {INTERVIEW_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
                                <input
                                    type="date"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                                    value={formData.interviewDate}
                                    onChange={e => setFormData({ ...formData, interviewDate: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Link (Optional)</label>
                        <input
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                            value={formData.link}
                            onChange={e => setFormData({ ...formData, link: e.target.value })}
                        />
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" className={styles.buttonSecondary} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.addButton}>Add Application</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
