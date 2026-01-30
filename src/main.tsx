import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApplicationProvider } from './contexts/ApplicationContext';
import { ResumeProvider } from './contexts/ResumeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApplicationProvider>
      <ResumeProvider>
        <App />
      </ResumeProvider>
    </ApplicationProvider>
  </StrictMode>,
)
