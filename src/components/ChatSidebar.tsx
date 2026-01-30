import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, Key } from 'lucide-react';
import styles from './ChatSidebar.module.css';
import { generateResponse, type ChatMessage } from '../services/ai';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SYSTEM_PROMPT = `
**Role:** You are the **Foster App Expert**, an intelligent assistant embedded within "Foster," a comprehensive job application tracking and management application.

**Identity:**
-   **Name:** FosterBot
-   **Tone:** Professional and encouraging, yet friendly and concise.
-   **Knowledge Base:**
    -   **Tracker:** A Kanban board to track job applications.
    -   **Resume Hub:** A tool to create, edit, resume versions, and upload PDF resumes.
    -   **ATS Scanner:** An analysis tool that compares resumes against job descriptions.
    -   **Interview Notes:** A dedicated space for preparing and recording notes for interviews.

**Constraints:**
-   **Scope Enforced:** Refuse questions unrelated to Foster, job hunting, or resumes.
-   **Privacy:** Do not ask for or store passwords.

**Response Guidelines:**
1.  **Be Direct:** Answer immediately.
2.  **Context Aware:** Provide step-by-step instructions for Foster.
`;

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [apiKey, setApiKey] = useLocalStorage<string>('foster_ai_key', '');

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "Hi! I'm FosterBot. Please enter your Gemini API Key to start chatting.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        // If asking for key
        if (!apiKey) {
            setApiKey(inputValue.trim());
            setMessages(prev => [...prev, { id: crypto.randomUUID(), text: "API Key saved! How can I help you?", sender: 'bot', timestamp: new Date() }]);
            setInputValue('');
            return;
        }

        const userMsg: Message = {
            id: crypto.randomUUID(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Prepare history for API
            const history: ChatMessage[] = [
                { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
                { role: 'model', parts: [{ text: "Understood. I am FosterBot, ready to assist." }] },
                ...messages.filter(m => m.id !== 'welcome').map(m => ({
                    role: m.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }]
                } as ChatMessage)),
                { role: 'user', parts: [{ text: inputValue }] }
            ];

            const responseText = await generateResponse(apiKey, history);

            const botMsg: Message = {
                id: crypto.randomUUID(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error: any) {
            console.error(error);
            const errorMsg: Message = {
                id: crypto.randomUUID(),
                text: "Error: " + error.message + ". Please check your API Key.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
            if (error.message.includes('key') || error.message.includes('403')) {
                setApiKey(''); // Reset invalid key
            }
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Context Floating Button (Visible when closed) */}
            {!isOpen && (
                <button
                    className={styles.floatButton}
                    onClick={() => setIsOpen(true)}
                    aria-label="Open Chat"
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {/* Sidebar Container */}
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <div className={styles.botIcon}>
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className={styles.title}>FosterBot</h3>
                            <span className={styles.status}>Online</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className={styles.closeButton}
                            onClick={() => {
                                if (confirm('Reset API Key?')) setApiKey('');
                            }}
                            title="Reset API Key"
                        >
                            <Key size={16} />
                        </button>
                        <button
                            className={styles.closeButton}
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className={styles.messagesContainer}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.userWrapper : styles.botWrapper}`}
                        >
                            <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.userBubble : styles.botBubble}`}>
                                {msg.text}
                            </div>
                            <span className={styles.timestamp}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    {isTyping && (
                        <div className={styles.typingIndicator}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={styles.inputArea}>
                    <div className={styles.inputWrapper}>
                        <textarea
                            className={styles.textarea}
                            placeholder={!apiKey ? "Paste Gemini API Key here..." : "Ask me anything..."}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            rows={1}
                        />
                        <button
                            className={styles.sendButton}
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isTyping}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className={styles.disclaimer}>AI can make mistakes. Verify important info.</p>
                </div>
            </div>
        </>
    );
}
