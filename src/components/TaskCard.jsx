/**
 * TaskCard.jsx
 * Tarjeta individual de tarea.
 * Props: task, onToggle, onEdit, onDelete
 */
import { Trash2, Pencil, Tag } from 'lucide-react'

// Colores de categoría
const CATEGORY_COLORS = {
    trabajo: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    estudio: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    personal: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
}

const CATEGORY_LABELS = { trabajo: 'Trabajo', estudio: 'Estudio', personal: 'Personal' }

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
    return (
        <div
            className={`group relative flex gap-4 p-4 rounded-2xl border transition-all animate-slide-up
        ${task.completed
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 opacity-70'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60'
                }`}
        >
            {/* Checkbox personalizado */}
            <button
                onClick={() => onToggle(task.id, task.completed)}
                aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
          ${task.completed
                        ? 'bg-violet-600 border-violet-600'
                        : 'border-slate-300 dark:border-slate-600 hover:border-violet-400'
                    }`}
            >
                {task.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3
                        className={`font-semibold text-slate-800 dark:text-slate-100 break-words
              ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}
                    >
                        {task.title}
                    </h3>
                    {task.category && (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[task.category] || CATEGORY_COLORS.personal}`}>
                            <Tag className="w-3 h-3" />
                            {CATEGORY_LABELS[task.category] || task.category}
                        </span>
                    )}
                </div>
                {task.description && (
                    <p className={`text-sm text-slate-500 dark:text-slate-400 break-words ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                    </p>
                )}
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                    {new Date(task.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(task)}
                    title="Editar"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    title="Eliminar"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
