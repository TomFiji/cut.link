import './css/App.css'
import HomePage from './pages/Home'
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin_Page';
import VerifyEmailPage from './pages/VerifyEmail';
import ForgotPasswordPage from './pages/ForgotPassword';
import ConfirmPasswordsPage from './pages/ConfirmPasswords';
import AllUrlsPage from './pages/AllUrls';
import AdminPage from './pages/AdminPage';
import Header from './components/Header'
import {Routes, Route, useLocation} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import AdminRoute from './components/AdminRoute';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';


function App() {
  const location = useLocation();
  
  //Pages where navbar should be hidden
  const noShowHeaderRoutes = ['/verify-email', '/error', '/forgot-password', '/confirm-passwords']
  const shouldShowHeader = !noShowHeaderRoutes.includes(location.pathname);
  return (
    <MantineProvider>
      <div className="app-shell">
        {shouldShowHeader && <Header />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/signup" element={<SignupPage />}/>
            <Route path="/signin" element={<SigninPage />}/>
            <Route path="/verify-email" element={<VerifyEmailPage />}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
            <Route path="/confirm-passwords" element={<ProtectedRoute>{<ConfirmPasswordsPage />}</ProtectedRoute>}/>
            <Route path="/all-urls" element={<AuthenticatedRoute>{<AllUrlsPage />}</AuthenticatedRoute>}  />
            <Route path="/admin" element={<AdminRoute>{<AdminPage />}</AdminRoute>}/>
          </Routes>
        </main>
      </div>
    </MantineProvider>
  )
}

export default App
