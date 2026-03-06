# TaskFlow — Gestión de Tareas Moderno

Una aplicación web full-stack moderna para gestionar tareas con autenticación, sincronización en tiempo real y modo oscuro.

## 🚀 Demo
> **URL de despliegue:** `https://tu-proyecto.vercel.app` *(reemplaza con tu URL de Vercel después del despliegue)*

---

## ✨ Características

- **Autenticación completa** con Supabase Auth: email/contraseña + Google OAuth
- **CRUD de tareas**: crear, editar, eliminar, marcar como completada/pendiente
- **Sincronización en tiempo real** con Supabase Realtime
- **Filtros**: todas, pendientes, completadas
- **Búsqueda** por título o descripción
- **Categorías**: Trabajo, Estudio, Personal
- **Dashboard con estadísticas**: total, pendientes, completadas
- **Modo oscuro / claro** con persistencia en localStorage
- **Responsive**: funciona en desktop y móvil
- **Row Level Security (RLS)**: cada usuario solo ve sus propias tareas

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS v3 |
| Autenticación | Supabase Auth |
| Base de datos | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime |
| Routing | React Router v6 |
| Notificaciones | react-hot-toast |
| Iconos | lucide-react |
| Deploy | Vercel |

---

## 📦 Instalación y uso local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/taskflow.git
cd taskflow
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y rellena con tus credenciales de Supabase:

```bash
cp .env.example .env
```

Edita `.env`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> Encuentra estas credenciales en [Supabase Dashboard](https://app.supabase.com) → tu proyecto → **Settings → API**

### 4. Configurar la base de datos en Supabase

Ejecuta el siguiente SQL en el **SQL Editor de Supabase**:

```sql
-- Crear tabla de tareas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'personal' CHECK (category IN ('personal', 'trabajo', 'estudio')),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para consultas por usuario
CREATE INDEX tasks_user_id_idx ON tasks (user_id);

-- Habilitar Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: cada usuario solo accede a sus tareas
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Habilitar Realtime para la tabla tasks
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🔧 Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL de tu proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima pública de Supabase |

---

## 🚢 Despliegue en Vercel

1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com) → **New Project** → importa tu repo
3. En **Environment Variables**, agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
4. Haz clic en **Deploy**

> Para que el enrutamiento SPA funcione en Vercel, el repositorio ya incluye la configuración necesaria en `vercel.json`.

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.jsx       # Navbar con dark mode y logout
│   ├── TaskCard.jsx     # Tarjeta de tarea individual
│   ├── TaskList.jsx     # Lista con filtros aplicados
│   └── TaskModal.jsx    # Modal crear/editar tarea
├── context/
│   └── AuthContext.jsx  # Contexto global de autenticación
├── hooks/
│   └── useTasks.js      # Hook CRUD + Realtime
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx    # Página principal con stats
├── services/
│   └── supabaseClient.js
├── App.jsx              # Routing + dark mode global
├── main.jsx
└── index.css
```

---

## 📄 Licencia

MIT
