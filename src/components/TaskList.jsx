/**
 * TaskList.jsx
 * Renderiza la lista de tareas filtradas.
 * Muestra estado vacío con mensajes contextuales.
 */
import TaskCard from './TaskCard'
import { ClipboardList } from 'lucide-react'

export default function TaskList({ tasks, filter, searchQuery, onToggle, onEdit, onDelete }) {
    // Aplicar filtros
    const filtered = tasks.filter((t) => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && !t.completed) ||
            (filter === 'completed' && t.completed)

        const query = searchQuery.toLowerCase()
        const matchesSearch =
            !query ||
            t.title.toLowerCase().includes(query) ||
            (t.description && t.description.toLowerCase().includes(query))

        return matchesFilter && matchesSearch
    })

    if (filtered.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
                <ClipboardList className="w-14 h-14 mb-4 opacity-50" />
                <p className="font-medium text-lg">
                    {searchQuery
                        ? 'Sin resultados para tu búsqueda'
                        : filter === 'completed'
                            ? 'No tienes tareas completadas'
                            : filter === 'pending'
                                ? '¡No tienes tareas pendientes!'
                                : 'No tienes tareas aún'}
                </p>
                <p className="text-sm mt-1">
                    {!searchQuery && filter === 'all' && 'Presiona el botón + para agregar tu primera tarea'}
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {filtered.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
