import { useRef } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import styles from './Settings.module.css';

export default function Settings() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = {
            applications: localStorage.getItem('foster_applications'),
            resumes: localStorage.getItem('foster_resumes'),
            interviewNotes: localStorage.getItem('foster_interview_notes'),
            aiKey: localStorage.getItem('foster_ai_key'),
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `foster_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                if (confirm('This will OVERWRITE your current data. Are you sure?')) {
                    if (data.applications) localStorage.setItem('foster_applications', data.applications);
                    if (data.resumes) localStorage.setItem('foster_resumes', data.resumes);
                    if (data.interviewNotes) localStorage.setItem('foster_interview_notes', data.interviewNotes);
                    if (data.aiKey) localStorage.setItem('foster_ai_key', data.aiKey);

                    alert('Data imported successfully! The page will now reload.');
                    window.location.reload();
                }
            } catch (error) {
                alert('Failed to import data. Invalid JSON file.');
                console.error(error);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Settings</h1>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Data Management</h2>
                <div className={styles.card}>
                    <p className={styles.description}>
                        Your data is stored locally in your browser. Use these tools to backup your data or move it to another device.
                    </p>

                    <div className={styles.actions}>
                        <button className={styles.button} onClick={handleExport}>
                            <Download size={20} />
                            Export Data
                        </button>

                        <div className={styles.separator}></div>

                        <input
                            type="file"
                            accept=".json"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImport}
                        />
                        <button
                            className={`${styles.button} ${styles.outline}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={20} />
                            Import Data
                        </button>
                    </div>

                    <div className={styles.warning}>
                        <AlertTriangle size={16} />
                        <span>Importing will replace your current data. Make sure you have a backup.</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
