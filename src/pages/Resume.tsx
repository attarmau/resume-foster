import { useState } from 'react';
import styles from './Resume.module.css';
import ResumeEditor from '../components/resume/ResumeEditor';
import ResumePreview from '../components/resume/ResumePreview';
import ResumeManager from '../components/resume/ResumeManager';

export default function Resume() {
    const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'versions'>('editor');

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Resume Hub</h1>
            </header>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'editor' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('editor')}
                >
                    Editor
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'preview' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('preview')}
                >
                    Quick Copy
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'versions' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('versions')}
                >
                    Versions
                </button>
            </div>

            {activeTab === 'editor' && <ResumeEditor />}
            {activeTab === 'preview' && <ResumePreview />}
            {activeTab === 'versions' && <ResumeManager />}
        </div>
    );
}
