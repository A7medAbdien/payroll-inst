import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/App.tsx'
import { initializeFrappeAPI } from '@services/index'

// Setup global frappe utilities
declare global {
  interface Window {
    csrf_token: string;
    frappe: {
      call: (method: string, args?: Record<string, any>) => Promise<any>;
      request: (options: any) => Promise<any>;
    };
  }
}

// Initialize Frappe API
initializeFrappeAPI();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
