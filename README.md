# ✅ MateCode — Gestión de tareas

SPA para organizar tareas por usuario con autenticación, persistencia en Cloud Firestore, fechas de vencimiento, prioridades, drag & drop y envío de resúmenes por email.

> 🚀 **Aplicación en producción:** [proyecto-m4-felix-figueroa.vercel.app](https://proyecto-m4-felix-figueroa.vercel.app/)

## ✨ Funcionalidades

- Registro e inicio de sesión con email/password o Google.
- Recuperación de contraseña mediante Firebase Authentication.
- Rutas protegidas para usuarios autenticados.
- Crear, editar, eliminar y completar tareas.
- Fechas de vencimiento y prioridades Alta, Media y Baja.
- Filtros por estado y prioridad.
- Drag & drop para reordenar tareas y moverlas entre Pendientes y Completadas.
- Email de confirmación después del registro con email/password.
- Resumen de tareas enviado por AWS SES.
- Reglas de Firestore para aislar las tareas por usuario.
- Interfaz responsive con feedback visual, tooltips y estados de carga/error.

## 🧰 Stack tecnológico

| Área | Tecnología |
| --- | --- |
| Frontend | React 19, TypeScript y Vite |
| Estilos | Tailwind CSS |
| Rutas | React Router |
| Autenticación | Firebase Authentication |
| Base de datos | Cloud Firestore en tiempo real |
| Drag & drop | dnd-kit |
| Email | AWS SES mediante función serverless |
| Testing | Vitest, Testing Library y mocks |
| Deploy | Vercel |

## ⚙️ Requisitos previos

- Node.js 20 o superior.
- npm.
- Proyecto de Firebase con Authentication y Firestore configurados.
- Cuenta de AWS SES con un remitente verificado.
- Cuenta de Vercel para el despliegue.

## 🚀 Ejecutar en local

### 1. Clonar el repositorio

```bash
git clone https://github.com/FFigueroa26/ProyectoM4_FelixFigueroa.git
cd ProyectoM4_FelixFigueroa
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia `.env.example` como `.env.local` y completa los valores correspondientes. No uses credenciales reales dentro del repositorio.

### 4. Iniciar el servidor

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

### 5. Comandos disponibles

```bash
npm run dev       # servidor de desarrollo
npm run build     # typecheck y build de producción
npm run lint      # análisis estático
npm test          # pruebas automatizadas
npm run preview   # vista previa del build
```

## 🔐 Variables de entorno

### Firebase — frontend

Estas variables usan el prefijo `VITE_` porque son leídas por la aplicación web:

| Variable | Uso |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | API de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de autenticación |
| `VITE_FIREBASE_PROJECT_ID` | Proyecto de Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Almacenamiento de Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Identificador del remitente |
| `VITE_FIREBASE_APP_ID` | Identificador de la aplicación |

### AWS SES — servidor

Estas variables se usan únicamente en la función serverless y deben configurarse en Vercel o en el entorno del servidor:

| Variable | Uso |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | Identificador de acceso AWS |
| `AWS_SECRET_ACCESS_KEY` | Clave secreta AWS |
| `AWS_REGION` | Región de AWS, por ejemplo `us-east-1` |
| `SES_FROM_EMAIL` | Remitente verificado en SES |

> 🔒 `.env`, `.env.local` y las credenciales reales no deben subirse al repositorio. `.env.example` solo contiene nombres de variables sin datos sensibles.

## 📧 Flujo de envío de emails

### Confirmación de registro

1. El usuario completa el registro con email y contraseña.
2. Firebase crea la cuenta.
3. `RegisterPage` solicita a `emailService` el envío del correo de confirmación.
4. La función serverless `/api/send-email` valida los datos y usa AWS SES.
5. AWS SES envía el mensaje desde `SES_FROM_EMAIL` al correo registrado.

### Resumen de tareas

1. El usuario pulsa **Enviar resumen de tareas**.
2. `SendTaskSummaryButton` construye el resumen con totales, estados, prioridades y fechas.
3. `emailService` hace una solicitud `POST` a `/api/send-email`.
4. La función serverless valida el destinatario y los campos obligatorios.
5. `SESClient` se configura usando las variables de entorno del servidor.
6. AWS SES envía el mensaje desde `SES_FROM_EMAIL` al correo del usuario.
7. La interfaz muestra el resultado de la operación.

Las credenciales de AWS nunca se importan en React ni se exponen al navegador.

## 🏗️ Decisiones arquitectónicas

- **React + TypeScript + Vite:** SPA rápida, tipada y sencilla de mantener.
- **React Router:** separa rutas públicas y protegidas mediante `PublicRoute` y `ProtectedRoute`.
- **Context API:** `AuthProvider` centraliza la sesión y las operaciones de autenticación.
- **Hooks y servicios:** `useTasks` coordina el estado de la interfaz, mientras `taskService` y `authService` encapsulan Firebase.
- **Firestore en tiempo real:** `onSnapshot` mantiene sincronizadas las tareas del usuario.
- **AWS SES en una función serverless:** mantiene las credenciales fuera del frontend.
- **dnd-kit:** resuelve el arrastre, la reordenación y el movimiento entre columnas.
- **Componentes reutilizables:** los formularios de autenticación comparten shell, campos y controles visuales.

## 📁 Estructura principal

```text
api/
└── send-email.ts             # Función serverless para AWS SES

src/
├── components/               # Componentes de autenticación y tareas
├── features/auth/            # Contexto y proveedor de autenticación
├── hooks/                    # useAuth y useTasks
├── pages/                   # Login, registro y tablero
├── routes/                  # Rutas públicas y protegidas
├── services/                # Firebase, autenticación, tareas y email
└── types/                   # Tipos TypeScript

tests/
├── components/              # Pruebas de componentes
└── unit/                    # Pruebas unitarias de servicios
```

## 🧪 Testing

El proyecto utiliza Vitest, Testing Library y mocks de servicios externos para no depender de Firebase, AWS o una base de datos real durante las pruebas.

```bash
npm test
```

La suite cubre:

- Formulario de tareas.
- Estados de carga, error y vacío del listado.
- Envío exitoso y fallido del resumen por email.
- Operaciones principales de `taskService`.
- Persistencia de posición y estado durante drag & drop.

## ☁️ Despliegue en Vercel

1. Importa el repositorio desde GitHub en Vercel.
2. Usa la raíz del repositorio como directorio del proyecto.
3. Configura las variables `VITE_*` de Firebase.
4. Configura las variables privadas de AWS SES.
5. Ejecuta el despliegue.
6. Cada push a `main` puede generar un nuevo despliegue automático.

URL pública: [https://proyecto-m4-felix-figueroa.vercel.app/](https://proyecto-m4-felix-figueroa.vercel.app/)

## 🤖 Uso de IA en el proceso de trabajo

La IA se utilizó como asistente de desarrollo, manteniendo la revisión y las decisiones finales en el proceso de trabajo.

### Situaciones en las que fue más efectiva

- Detectar imports, archivos sin referencias y duplicaciones potenciales.
- Proponer componentes reutilizables para login y registro.
- Crear y adaptar pruebas con mocks de Firestore y email.
- Diagnosticar errores de TypeScript, como los matchers de `jest-dom`.
- Iterar sobre detalles de UX: foco automático, tooltips, feedback al completar tareas y preview del drag & drop.

### Patrones y buenas prácticas descubiertos

- Revisar primero el alcance local antes de editar.
- Hacer cambios pequeños y validar cada uno con lint, tests y build.
- Separar funcionalidades por commits como `feat(tasks)` y `feat(auth)`.
- Mantener las credenciales fuera del código y del historial de Git.
- Usar mocks para probar servicios externos sin tocar Firebase o AWS reales.
- Mantener la lógica de negocio en servicios y hooks, dejando los componentes enfocados en la interfaz.
- Combinar validación automatizada con revisión visual manual, especialmente en cambios de UX.

## 📌 Estado del proyecto

La aplicación está desplegada y disponible públicamente en Vercel. El repositorio contiene autenticación, CRUD de tareas, persistencia en Firestore, envío de emails con AWS SES, filtros, fechas, prioridades y drag & drop.
