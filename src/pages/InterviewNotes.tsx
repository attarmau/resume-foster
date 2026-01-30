import { useState } from 'react';
import { useInterviewNotes } from '../hooks/useInterviewNotes';
import styles from './InterviewNotes.module.css';
import { Plus, Trash2, Library } from 'lucide-react';

const PREDEFINED_CATEGORIES = [
    'Behavioral',
    'Technical',
    'Company Research',
    'Questions to Ask',
    'System Design',
    'Coding',
];

export default function InterviewNotes() {
    const { notes, addNote, updateNote, deleteNote, getCategories } = useInterviewNotes();
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');

    // Merge user categories with predefined ones
    const allCategories = Array.from(new Set([...PREDEFINED_CATEGORIES, ...getCategories()])).sort();

    const filteredNotes = selectedCategory === 'all'
        ? notes
        : notes.filter(n => n.category === selectedCategory);

    const handleAddNote = () => {
        addNote({
            category: selectedCategory === 'all' ? 'Behavioral' : selectedCategory,
            question: 'New Question',
            content: '',
        });
    };

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div>
                    <h2 className={styles.sidebarTitle}>
                        <Library size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Categories
                    </h2>
                    <div className={styles.categoryList}>
                        <button
                            className={`${styles.categoryItem} ${selectedCategory === 'all' ? styles.categoryItemActive : ''}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            All Notes
                        </button>
                        {allCategories.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.categoryItem} ${selectedCategory === cat ? styles.categoryItemActive : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Interview Notes</h1>
                    <button className={styles.addButton} onClick={handleAddNote}>
                        <Plus size={20} />
                        Add Note
                    </button>
                </header>

                <div className={styles.notesGrid}>
                    {filteredNotes.length === 0 ? (
                        <div style={{
                            gridColumn: '1/-1',
                            textAlign: 'center',
                            padding: '4rem',
                            color: 'hsl(var(--muted-foreground))',
                            border: '2px dashed hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                        }}>
                            <Library size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>No notes found for this category.</p>
                            <button
                                onClick={handleAddNote}
                                style={{
                                    marginTop: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    color: 'hsl(var(--primary))',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Create your first note
                            </button>
                        </div>
                    ) : (
                        filteredNotes.map(note => (
                            <div key={note.id} className={styles.noteCard}>
                                <button className={styles.deleteButton} onClick={() => deleteNote(note.id)}>
                                    <Trash2 size={16} />
                                </button>

                                <div className={styles.noteHeader}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <select
                                            className={styles.noteCategory}
                                            value={note.category}
                                            onChange={(e) => updateNote(note.id, { category: e.target.value })}
                                            style={{
                                                border: 'none',
                                                appearance: 'none',
                                                paddingRight: '1rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <input
                                    className={`${styles.inputs} ${styles.questionInput}`}
                                    value={note.question}
                                    onChange={(e) => updateNote(note.id, { question: e.target.value })}
                                    placeholder="Interview Question"
                                />

                                <textarea
                                    className={`${styles.inputs} ${styles.contentInput}`}
                                    value={note.content}
                                    onChange={(e) => updateNote(note.id, { content: e.target.value })}
                                    placeholder="Type your answer, STAR method notes, or key points here..."
                                />
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
