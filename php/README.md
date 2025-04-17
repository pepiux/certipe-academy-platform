
# Backend PHP para CertiPE

Este directorio contiene la implementación del backend en PHP para la aplicación CertiPE, una plataforma de cursos y certificaciones online.

## Estructura de archivos

- `config.php`: Archivo de configuración con conexión a la base de datos y funciones utilitarias
- `auth.php`: Maneja la autenticación de usuarios (login)
- `register.php`: Registro de nuevos usuarios
- `logout.php`: Cierre de sesión
- `courses.php`: API para obtener listado de cursos con filtros
- `course.php`: API para obtener detalles de un curso específico
- `quizzes.php`: API para obtener listado de cuestionarios con filtros
- `quiz.php`: API para obtener detalles de un cuestionario específico
- `database.sql`: Archivo SQL con la estructura de la base de datos y datos iniciales

## Configuración

1. Importar el archivo `database.sql` en tu servidor MySQL
2. Editar el archivo `config.php` con los datos correctos de conexión a la base de datos:
   - DB_HOST: dirección del servidor de base de datos (normalmente "localhost")
   - DB_USER: nombre de usuario de MySQL
   - DB_PASSWORD: contraseña de MySQL
   - DB_NAME: nombre de la base de datos (por defecto "certipe_db")

## Uso

Esta API está diseñada para ser consumida por el frontend de CertiPE, que puede alternar entre usar datos mock o este backend PHP mediante la configuración del archivo `src/config.ts`.

## Autenticación

La API utiliza autenticación basada en tokens. Al iniciar sesión o registrarse, se devuelve un token que debe incluirse en las cabeceras HTTP de las peticiones subsiguientes:

```
Authorization: Bearer {token}
```

## Credenciales de prueba

- Administrador: admin@certipe.com / admin123
- Instructor: profesor@certipe.com / profesor123
- Estudiante: estudiante@certipe.com / estudiante123
