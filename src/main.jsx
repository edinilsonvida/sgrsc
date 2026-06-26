import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'flatpickr/dist/flatpickr.min.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
