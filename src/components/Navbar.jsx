/**
 * Navbar.jsx
 * Barra de navegación con nombre del usuario, toggle de modo oscuro y botón de logout.
 */
import { useAuth } from '../context/AuthContext'
import { Sun, Moon, LogOut, CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar({ darkMode, toggleDarkMode }) {
    const { user, signOut } = useAuth()

    const handleSignOut = async () => {
        try {
            await signOut()
            toast.success('Sesión cerrada')
        } catch {
            toast.error('Error al cerrar sesión')
        }
    }

    return (
        <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                        <CheckSquare className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-lg text-slate-800 dark:text-white tracking-tight">
                        TaskFlow
                    </span>
                </div>

                {/* Controles */}
                <div className="flex items-center gap-3">
                    {user && (
                        <span className="hidden sm:block text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                            {user.email}
                        </span>
                    )}

                    {/* Toggle modo oscuro */}
                    <button
                        onClick={toggleDarkMode}
                        title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Logout */}
                    {user && (
                        <button
                            onClick={handleSignOut}
                            title="Cerrar sesión"
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}
