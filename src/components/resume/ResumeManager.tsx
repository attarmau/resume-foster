import { useState, useRef } from 'react';
import { useResumes } from '../../hooks/useResumes';
import { Upload, FileText, Trash2, ExternalLink } from 'lucide-react';
import styles from './ResumeManager.module.css';

export default function ResumeManager() {
    const { resumes, addResume, deleteResume } = useResumes();
    const [uploadJobRole, setUploadJobRole] = useState('');
    const [uploadName, setUploadName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get unique roles for suggestion/filtering
    const roles = Array.from(new Set(resumes.map(r => r.role)));

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert("File is too large. Please upload a specific PDF under 5MB.");
            return;
        }

        // Convert file to Data URI for storage
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileUrl = event.target?.result as string;

            addResume({
                name: uploadName || file.name,
                role: uploadJobRole || 'General',
                fileName: file.name,
                fileUrl: fileUrl
            });

            // Reset form
            setUploadName('');
            setUploadJobRole('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsDataURL(file);
    };

    const handleView = (url: string) => {
        // Open data URI in new tab (might need adjustment for some browsers)
        const pdfWindow = window.open("");
        if (pdfWindow) {
            pdfWindow.document.write(
                `<iframe width='100%' height='100%' src='${url}'></iframe>`
            );
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.uploadSection}>
                <h2 className={styles.sectionTitle}>Upload New Version</h2>
                <div className={styles.uploadForm}>
                    <div className={styles.inputGroup}>
                        <label>Role / Category</label>
                        <input
                            type="text"
                            placeholder="e.g. Frontend Developer"
                            value={uploadJobRole}
                            onChange={(e) => setUploadJobRole(e.target.value)}
                            list="roles-list"
                        />
                        <datalist id="roles-list">
                            {roles.map(role => <option key={role} value={role} />)}
                        </datalist>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Version Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Revised Draft"
                            value={uploadName}
                            onChange={(e) => setUploadName(e.target.value)}
                        />
                    </div>
                    <div className={styles.fileInputWrapper}>
                        <input
                            type="file"
                            accept="application/pdf"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className={styles.uploadButton}>
                            <Upload size={16} />
                            <span>Select PDF</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className={styles.listSection}>
                <h2 className={styles.sectionTitle}>Your Resumes</h2>
                {roles.length === 0 ? (
                    <p className={styles.emptyState}>No resumes uploaded yet.</p>
                ) : (
                    roles.map(role => (
                        <div key={role} className={styles.roleGroup}>
                            <h3 className={styles.roleTitle}>{role}</h3>
                            <div className={styles.resumeGrid}>
                                {resumes.filter(r => r.role === role).map(resume => (
                                    <div key={resume.id} className={styles.resumeCard}>
                                        <div className={styles.cardIcon}>
                                            <FileText size={24} />
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <p className={styles.resumeName}>{resume.name}</p>
                                            <p className={styles.fileName}>{resume.fileName}</p>
                                            <p className={styles.date}>{new Date(resume.dateUploaded).toLocaleDateString()}</p>
                                        </div>
                                        <div className={styles.cardActions}>
                                            <button
                                                onClick={() => handleView(resume.fileUrl)}
                                                className={styles.actionButton}
                                                title="View"
                                            >
                                                <ExternalLink size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteResume(resume.id)}
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
