import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './providers/client';
import Home from './pages/Home';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/signin" element={
                <PublicRoute>
                  <SignInPage />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <SignUpPage />
                </PublicRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;