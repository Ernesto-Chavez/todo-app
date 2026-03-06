/**
 * App.jsx
 * Configuración de rutas con React Router.
 * - Rutas públicas: /login, /register
 * - Rutas protegidas: / (Dashboard)
 * - Gestiona el modo oscuro globalmente.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

/** Ruta protegida: redirige a /login si no hay sesión */
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }
    return user ? children : <Navigate to="/login" replace />
}

/** Ruta pública: redirige al dashboard si ya hay sesión */
function PublicRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) return null
    return user ? <Navigate to="/" replace /> : children
}

function AppRoutes() {
    // ─── Modo oscuro ─────────────────────────────────────────────
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('taskflow-dark')
        if (stored !== null) return stored === 'true'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode)
        localStorage.setItem('taskflow-dark', darkMode)
    }, [darkMode])

    const toggleDarkMode = () => setDarkMode((d) => !d)

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    </ProtectedRoute>
                }
            />
            {/* Cualquier ruta no encontrada → dashboard o login */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontFamily: 'Inter, sans-serif',
                        },
                    }}
                />
            </BrowserRouter>
        </AuthProvider>
    )
}
