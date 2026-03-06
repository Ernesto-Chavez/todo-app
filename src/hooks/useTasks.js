/**
 * useTasks.js
 * Hook personalizado para manejar las tareas del usuario actual.
 * Provee: tasks, loading, error, createTask, updateTask, deleteTask, toggleComplete
 * Incluye suscripción en tiempo real con Supabase Realtime.
 */
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useTasks() {
    const { user } = useAuth()
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // ─── Cargar tareas iniciales ───────────────────────────────────────────────
    const fetchTasks = useCallback(async () => {
        if (!user) return
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setTasks(data)
        } catch (err) {
            setError(err.message)
            toast.error('Error al cargar las tareas')
        } finally {
            setLoading(false)
        }
    }, [user])

    // ─── Suscripción en tiempo real ────────────────────────────────────────────
    useEffect(() => {
        if (!user) return

        fetchTasks()

        const channel = supabase
            .channel(`tasks:user_${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',          // INSERT | UPDATE | DELETE
                    schema: 'public',
                    table: 'tasks',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setTasks((prev) => [payload.new, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        setTasks((prev) =>
                            prev.map((t) => (t.id === payload.new.id ? payload.new : t))
                        )
                    } else if (payload.eventType === 'DELETE') {
                        setTasks((prev) => prev.filter((t) => t.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, fetchTasks])

    // ─── Crear tarea ───────────────────────────────────────────────────────────
    const createTask = async ({ title, description, category }) => {
        if (!title.trim()) {
            toast.error('El título es obligatorio')
            return
        }
        try {
            const { error } = await supabase.from('tasks').insert([
                {
                    user_id: user.id,
                    title: title.trim(),
                    description: description?.trim() || null,
                    category: category || 'personal',
                    completed: false,
                },
            ])
            if (error) throw error
            toast.success('Tarea creada')
        } catch (err) {
            toast.error('Error al crear la tarea: ' + err.message)
        }
    }

    // ─── Actualizar tarea ──────────────────────────────────────────────────────
    const updateTask = async (id, { title, description, category }) => {
        if (!title.trim()) {
            toast.error('El título no puede estar vacío')
            return
        }
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ title: title.trim(), description: description?.trim() || null, category })
                .eq('id', id)
                .eq('user_id', user.id)

            if (error) throw error
            toast.success('Tarea actualizada')
        } catch (err) {
            toast.error('Error al actualizar: ' + err.message)
        }
    }

    // ─── Eliminar tarea ────────────────────────────────────────────────────────
    const deleteTask = async (id) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id)

            if (error) throw error
            toast.success('Tarea eliminada')
        } catch (err) {
            toast.error('Error al eliminar: ' + err.message)
        }
    }

    // ─── Cambiar estado completado/pendiente ───────────────────────────────────
    const toggleComplete = async (id, completed) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ completed: !completed })
                .eq('id', id)
                .eq('user_id', user.id)

            if (error) throw error
        } catch (err) {
            toast.error('Error al actualizar la tarea: ' + err.message)
        }
    }

    return { tasks, loading, error, createTask, updateTask, deleteTask, toggleComplete }
}
