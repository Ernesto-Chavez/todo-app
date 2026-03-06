/**
 * TaskModal.jsx
 * Modal para crear o editar una tarea.
 * Props: isOpen, onClose, onSubmit, initialData (null = crear)
 */
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

const CATEGORIES = [
    { value: 'personal', label: '🟢 Personal' },
    { value: 'trabajo', label: '🔵 Trabajo' },
    { value: 'estudio', label: '🟡 Estudio' },
]

export default function TaskModal({ isOpen, onClose, onSubmit, initialData }) {
    const isEditing = !!initialData
    const inputRef = useRef(null)

    const [form, setForm] = useState({ title: '', description: '', category: 'personal' })
    const [submitting, setSubmitting] = useState(false)

    // Sincronizar formulario con datos iniciales
    useEffect(() => {
        if (isOpen) {
            setForm({
                title: initialData?.title || '',
                description: initialData?.description || '',
                category: initialData?.category || 'personal',
            })
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [isOpen, initialData])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title.trim()) return
        setSubmitting(true)
        await onSubmit(form)
        setSubmitting(false)
        onClose()
    }

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose()
    }

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={handleBackdrop}
        >
            {/* Panel del modal */}
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-white">
                        {isEditing ? 'Editar tarea' : 'Nueva tarea'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Título <span className="text-red-500">*</span>
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="¿Qué tienes que hacer?"
                            maxLength={120}
                            required
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Descripción <span className="text-slate-400 text-xs">(opcional)</span>
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Agrega más detalles..."
                            rows={3}
                            maxLength={500}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none"
                        />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Categoría
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setForm({ ...form, category: cat.value })}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                    ${form.category === cat.value
                                            ? 'bg-violet-600 border-violet-600 text-white'
                                            : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-violet-400'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !form.title.trim()}
                            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
                        >
                            {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear tarea'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
