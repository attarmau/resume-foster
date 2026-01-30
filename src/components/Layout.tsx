import { Link, useLocation } from 'react-router-dom';
import { FileText, Briefcase, Search, BookOpen, Cog } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import { useApplications } from '../hooks/useApplications';
import { isToday, isThisWeek, parseISO } from 'date-fns';
import ChatSidebar from './ChatSidebar';

const SidebarItem = ({ to, icon: Icon, label, active }: any) => (
    <Link
        to={to}
        className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

export default function Layout() {
    const location = useLocation();
    const { applications } = useApplications();

    const todayCount = applications.filter(app => {
        if (!app.dateApplied) return false;
        const date = parseISO(app.dateApplied);
        return !isNaN(date.getTime()) && isToday(date);
    }).length;

    const weekCount = applications.filter(app => {
        if (!app.dateApplied) return false;
        const date = parseISO(app.dateApplied);
        return !isNaN(date.getTime()) && isThisWeek(date, { weekStartsOn: 1 });
    }).length;

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        Foster
                    </h1>
                    <p className={styles.subtitle}>Job Application Assistant</p>
                </div>

                <nav className={styles.nav}>
                    <SidebarItem
                        to="/tracker"
                        icon={Briefcase}
                        label="Tracker"
                        active={location.pathname.includes('/tracker')}
                    />
                    <SidebarItem
                        to="/resume"
                        icon={FileText}
                        label="Resume Hub"
                        active={location.pathname.includes('/resume')}
                    />
                    <SidebarItem
                        to="/scanner"
                        icon={Search}
                        label="ATS Scanner"
                        active={location.pathname.includes('/scanner')}
                    />
                    <SidebarItem
                        to="/notes"
                        icon={BookOpen}
                        label="Interview Prep"
                        active={location.pathname.includes('/notes')}
                    />
                    <div style={{ flex: 1 }}></div>
                    <SidebarItem
                        to="/settings"
                        icon={Cog}
                        label="Settings"
                        active={location.pathname.includes('/settings')}
                    />
                </nav>

                <div className={styles.footer}>
                    <div className={styles.statsCard}>
                        <p className={styles.statsTitle}>Applications Today</p>
                        <p className={styles.statsValue}>{todayCount}</p>
                    </div>
                    <div className={styles.statsCard} style={{ marginTop: '0.5rem' }}>
                        <p className={styles.statsTitle}>This Week</p>
                        <p className={styles.statsValue}>{weekCount}</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <Outlet />
            </main>

            <ChatSidebar />
        </div>
    );
}
