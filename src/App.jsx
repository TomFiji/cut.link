import './css/App.css'
import HomePage from './pages/Home'
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin_Page';
import VerifyEmailPage from './pages/VerifyEmail';
import ForgotPasswordPage from './pages/ForgotPassword';
import ConfirmPasswordsPage from './pages/ConfirmPasswords';
import {Routes, Route, useLocation} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

  return (
    <div className="app-shell">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/signup" element={<SignupPage />}/>
          <Route path="/signin" element={<SigninPage />}/>
          <Route path="/verify-email" element={<VerifyEmailPage />}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
          <Route path="/confirm-passwords" element={<ProtectedRoute>{<ConfirmPasswordsPage />}</ProtectedRoute>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App
