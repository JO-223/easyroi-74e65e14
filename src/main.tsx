
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext'
import { Toaster } from './components/ui/toaster'

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
    <Toaster />
  </LanguageProvider>
);
