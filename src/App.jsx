import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './common/ProtectedRoute'
import PublicRoute from './common/PublicRoute'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
// TODO: import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>

          {/* ── Root redirect ───────────────── */}
          <Route path="/" element={<Navigate to="/signup" replace />} />

          {/* ── Public routes ───────────────── */}
          {/* Logged in? → redirects to /dashboard */}
          <Route path="/signup" element={
            <PublicRoute><SignUp /></PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute><Login /></PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute><ForgotPassword /></PublicRoute>
          } />

          {/* ── Protected routes ────────────── */}
          {/* Not logged in? → redirects to /login */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          {/* TODO: add when built */}
          {/* <Route path="/reset-password" element={
            <PublicRoute><ResetPassword /></PublicRoute>
          } /> */}

        </Routes>
      </AppProvider>
    </AuthProvider>
  )
}

export default App