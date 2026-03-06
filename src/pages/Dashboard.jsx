/**
 * Dashboard.jsx
 * Página principal de la aplicación. Muestra estadísticas, filtros,
 * barra de búsqueda, lista de tareas y botón flotante para crear.
 */
import { useState } from 'react'
import Navbar from '../components/Navbar'
import TaskList from '../components/TaskList'
import TaskModal from '../components/TaskModal'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../context/AuthContext'
import { Plus, Search, CheckCircle2, Clock, ListTodo } from 'lucide-react'

export default function Dashboard({ darkMode, toggleDarkMode }) {
    const { user } = useAuth()
    const { tasks, loading, createTask, updateTask, deleteTask, toggleComplete } = useTasks()

    // Estado local de UI
    const [filter, setFilter] = useState('all')        // 'all' | 'pending' | 'completed'
    const [searchQuery, setSearchQuery] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)

    // ─── Estadísticas ─────────────────────────────────────────
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const pending = total - completed

    // ─── Handlers ─────────────────────────────────────────────
    const handleCreate = () => {
        setEditingTask(null)
        setModalOpen(true)
    }

    const handleEdit = (task) => {
        setEditingTask(task)
        setModalOpen(true)
    }

    const handleModalSubmit = async (form) => {
        if (editingTask) {
            await updateTask(editingTask.id, form)
        } else {
            await createTask(form)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar esta tarea?')) {
            await deleteTask(id)
        }
    }

    // ─── Filtros ────────────────────────────────────────────────
    const FILTERS = [
        { key: 'all', label: 'Todas' },
        { key: 'pending', label: 'Pendientes' },
        { key: 'completed', label: 'Completadas' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Saludo */}
                <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                        👋 Hola, <span className="text-violet-600">{user?.email?.split('@')[0]}</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                        {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <StatCard
                        icon={<ListTodo className="w-5 h-5" />}
                        label="Total"
                        value={total}
                        color="text-slate-700 dark:text-slate-300"
                        bg="bg-slate-100 dark:bg-slate-800"
                    />
                    <StatCard
                        icon={<Clock className="w-5 h-5" />}
                        label="Pendientes"
                        value={pending}
                        color="text-amber-600 dark:text-amber-400"
                        bg="bg-amber-50 dark:bg-amber-900/30"
                    />
                    <StatCard
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        label="Completadas"
                        value={completed}
                        color="text-violet-600 dark:text-violet-400"
                        bg="bg-violet-50 dark:bg-violet-900/30"
                    />
                </div>

                {/* Barra de búsqueda */}
                <div className="relative mb-4">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar tareas..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                    />
                </div>

                {/* Tabs de filtro */}
                <div className="flex gap-2 mb-6">
                    {FILTERS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                ${filter === key
                                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-violet-400'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Lista de tareas */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <TaskList
                        tasks={tasks}
                        filter={filter}
                        searchQuery={searchQuery}
                        onToggle={toggleComplete}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </main>

            {/* Botón flotante FAB */}
            <button
                onClick={handleCreate}
                title="Nueva tarea"
                className="fixed right-6 bottom-8 z-30 w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
                <Plus className="w-7 h-7" />
            </button>

            {/* Modal */}
            <TaskModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingTask}
            />
        </div>
    )
}

/** Componente interno para tarjeta de estadística */
function StatCard({ icon, label, value, color, bg }) {
    return (
        <div className={`${bg} rounded-2xl p-4 flex flex-col gap-1`}>
            <div className={`${color} flex items-center gap-1.5`}>
                {icon}
                <span className="text-xs font-medium">{label}</span>
            </div>
            <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
        </div>
    )
}
