import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TenantProvider from './contexts/TenantContext';
import AuthProvider from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import { useAuth } from './hooks/useAuth';
import './utils/testApi'; // Load test functions
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">กำลังตรวจสอบสิทธิ์...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">กำลังตรวจสอบสิทธิ์...</div>;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/profile" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </TenantProvider>
  );
}

export default App;