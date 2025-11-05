import './css/App.css'
import HomePage from './pages/Home'
import {Routes, Route, useLocation} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

  return (
    <div className="app-shell">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute>{<HomePage />}</ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
