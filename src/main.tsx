import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './providers/client'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </StrictMode>
  </QueryClientProvider>,
)
