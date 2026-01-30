import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

import Resume from './pages/Resume';
import Tracker from './pages/Tracker';
import Scanner from './pages/Scanner';
import InterviewNotes from './pages/InterviewNotes';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/tracker" replace />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="resume" element={<Resume />} />
          <Route path="scanner" element={<Scanner />} />
          <Route path="notes" element={<InterviewNotes />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
