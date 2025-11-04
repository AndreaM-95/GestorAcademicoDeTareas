<h1 align-text:"center">API Gestor académico de tareas</h1>


# 📘 Documentación

- **Nombre del proyecto:** API gestor académico de tareas 
- **Versión actual:** v1.0.0
- **Última actualización:** 04/11/2025  
- **Autores:** `Leidy Alvarez`, `Maria Vargas`, `Andrea Mejía`, `Luna Salas`, 

---

## ⚙️ Tecnologías utilizadas

- **NestJS** (Framework principal)
- **TypeScript**
- **MySQL** (Base de datos)
- **DBeaver** (Cliente de administración de BD)
- **Postman** (Pruebas de endpoints)
- **bcrypt** (Encriptación de contraseñas)
- **JWT** (Autenticación por tokens)

---

## Configuración del proyecto

```bash
$ npm install
```

## Compila y ejecuta el proyecto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 📂 Estructura del proyecto

```
src/
 ├── common/
 │   ├── decorators
 │   │   └── roles.decorator.ts
 │   ├── enums
 │   │   └── roles.enum.ts
 │   ├── exceptions
 │   |   ├── auth
 |   |   |   ├── invalid-credentials.exception.ts
 |   |   |   ├── token-expired.exception.ts
 |   |   |   └── token-invalid.exception.ts
 │   |   ├── grades
 |   |   |   ├── duplicate-grade.exception.ts
 |   |   |   ├── grade-not-found.exception.ts
 |   |   |   ├── invalid-grade-value.exception.ts
 |   |   |   └── no-grade.exception.ts
 │   |   ├── tasks
 |   |   |   ├── invalid-task-deadline.exception.ts
 |   |   |   ├── task-already-exists.exception.ts
 |   |   |   ├── task-not-found.exception.ts
 |   |   |   └── unauthorized-task-access.exception.ts
 │   |   └── users
 |   |       ├── email-already-exists.exception.ts
 |   |       ├── unauthorized-role-action.exception.ts
 |   |       └── user-not-found.exception.ts
 │   ├── filters
 │   │   └── global-exception.filter.ts
 │   └── guards
 │       ├── jwt-guard.ts
 │       └── roles.guard.ts
 ├── dto/
 │   ├── create-grade.dto.ts
 │   ├── create-task.dto.ts
 │   ├── create-user.dto.ts
 │   ├── update-grade.dto.ts
 │   ├── update-task.dto.ts
 │   └── update-user.dto.ts
 ├── entities/
 │   ├── grade.entity.ts
 │   ├── task.entity.ts
 │   └── user.entity.ts
 ├── migrations/
 │   └── 1761426148341-InitMigration.ts
 ├── modules/
 |   ├── auth/
 │   |   ├── auth.controller.ts
 │   |   ├── auth.module.ts
 │   |   └── auth.service.ts
 |   ├── grades/
 │   |   ├── grades.controller.ts
 │   |   ├── grades.module.ts
 │   |   └── grades.service.ts
 │   ├── tasks/
 │   |   ├── tasks.controller.ts
 │   |   ├── tasks.module.ts
 │   |   └── tasks.service.ts
 |   └── users/
 │       ├── users.controller.ts
 │       ├── users.module.ts
 │       └── users.service.ts
 ├── app.controller.spec.ts
 ├── app.controller.ts
 ├── app.module.ts
 ├── app.service.ts
 └── main.ts
```

---

## 🚀 Endpoints principales

### 🔐 Autenticación
| Método | Ruta | Descripción | Requiere Token |
|--------|-------|--------------|----------------|
| `POST` | `/api/authM/register` | Registra un nuevo usuario | ❌ |
| `POST` | `/api/authM/login` | Inicia sesión y devuelve token JWT | ❌ |
| `GET` | `/api/authM/profile` | Devuelve la informacion del usuario | ✅ |

---

### 👤 Usuarios
| Método | Ruta | Descripción | Requiere Token | Rol permitido |
|--------|-------|--------------|----------------|----------------|
| `POST` | `/api/users` | Crea un nuevo usuario | ✅ | Professor |
| `GET` | `/api/users` | Obtiene todos los usuarios | ✅ | Professor & Student |
| `GET` | `/api/users/role/students` | Obtiene solo los estudiantes | ✅ | Professor |
| `GET` | `/api/users/:id` | Obtiene un solo usuario | ✅ | Professor & Student |
| `PATCH` | `/api/users/:id` | Actualiza a un usuario | ✅ | Professor |
| `PATCH` | `/api/users/:id` | Desactiva a un usuario | ✅ | Professor |

---

### 📝 Tareas
| Método | Ruta | Descripción | Requiere Token | Rol permitido |
|--------|-------|--------------|----------------|----------------|
| `POST` | `/api/tasks` | Crea una nueva tarea | ✅ | Professor |
| `GET` | `/api/tasks` | Obtiene todas las tareas | ✅ | Professor & Student |
| `GET` | `/api/tasks/:id` | Obtiene una sóla tarea | ✅ | Professor & Student |
| `PUT` | `/api/tasks/:id` | Actualiza una tarea | ✅ | Professor |
| `DELETE` | `/api/tasks/:id` | Elimina una tarea | ✅ | Professor |

---

### ✅ Calificaciones
| Método | Ruta | Descripción | Requiere Token | Rol permitido |
|--------|-------|--------------|----------------|----------------|
| `POST` | `/api/grades` | Crea una calificación | ✅ | Profesor |
| `PATCH` | `/api/grades/:id` | Actualiza una calificación | ✅ | Profesor |
| `GET` | `/api/grades/student/:studentId` | Muestra las notas de un estudiante | ✅ | Profesor |
| `GET` | `/api/grades/student/:studentId/average` | Devuelve el promedio de las notas | ✅ | Profesor - Estudiante |
| `DELETE` | `/api/grades/:id` | Elimina una calificación | ✅ | Profesor |

---

## 🔑 Autenticación

- Los endpoints protegidos requieren un **token JWT** en el header:  
  ```
  Authorization: Bearer <token>
  ```
- Los tokens se generan al iniciar sesión (`/api/authM/login`).  
- Las contraseñas se almacenan **encriptadas con bcrypt** antes de guardarse en la base de datos.

---

## 🧪 Pruebas con Postman

- **Colección:** `Consultas-UsuariosProductos.postman_collection.json`
- **Variable de entorno:**  
  ```
  {{BASE_URL}} = http://localhost:4000
  ```

### Ejemplo de flujo de prueba

1. Registrar un usuario (`/api/authM/register`)
2. Iniciar sesión (`/api/authM/login`)
3. Copiar el token JWT devuelto
4. Usar el token para acceder a `/api/users`, `/api/tasks` o `/api/grades`

**Ejemplo de Login Request:**
```json
{
  "email": "user@ejemplo.com",
  "password": "123456"
}
```

**Ejemplo de Login Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## ⚙️ Configuración del entorno

Archivo `.env`:
```
PORT = 4000
APP_NAME= ManagerUsers
DB_HOST= localhost
DB_PORT= 3306
DB_USERNAME= nombre_de_usuario
DB_PASSWORD= contraseña
DB_NAME= nombre_base_de_datos
JWT_SECRET_KEY= llave_secreta
JWT_EXPIRES_IN= tiempo_expiracion_token
```

---

## 🧩 Notas adicionales

- Proyecto probado con **Postman** localmente.  
- Base de datos administrada con **DBeaver**.  
- Las rutas están protegidas con `JwtAuthGuard` excepto `/api/authM/register` y `/api/authM/login`.  
- Documentación de la API en Swagger.

---

📄 **Fin de la documentación**
