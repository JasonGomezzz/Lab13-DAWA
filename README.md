# Lab 13 — Autenticación y seguridad con NextAuth.js

Aplicación Next.js (App Router) con autenticación mediante **Google OAuth**, **GitHub OAuth** y **credenciales** (correo y contraseña con registro, bcrypt y bloqueo por intentos fallidos). Laboratorio de Desarrollo de Aplicaciones Web Avanzado (TECSUP).

Repositorio: https://github.com/JasonGomezzz/Lab13-DAWA

## Requisitos

- Node.js 20.9 o superior (el enunciado pide > 18.18; Next.js 16 exige 20.9+).
- Credenciales OAuth de Google y, para la tarea, de GitHub.

## Instalación y ejecución

```bash
npm install
cp .env.example .env.local   # completar las variables
npm run dev                  # http://localhost:3000
```

Otros scripts: `npm run build`, `npm start`, `npm run lint`.

## Variables de entorno

Ver [.env.example](.env.example). Los valores reales van en `.env.local` (ignorado por git).

| Variable | Uso |
| --- | --- |
| `NEXTAUTH_URL` | URL base de la app (`http://localhost:3000` en local, la URL de Vercel en producción) |
| `NEXTAUTH_SECRET` | Firma de los JWT de sesión (`openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credenciales → ID de cliente OAuth |
| `GITHUB_ID` / `GITHUB_SECRET` | GitHub → Settings → Developer settings → OAuth Apps (el botón de GitHub solo aparece si existen) |
| `DATABASE_URL` | PostgreSQL (opcional en local, obligatoria en Vercel) |

URIs de redirección autorizadas:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`
- En producción, las mismas rutas con el dominio de Vercel.

## Estructura

```
src/
├─ app/
│  ├─ api/auth/[...nextauth]/route.ts   # handler de NextAuth
│  ├─ api/register/route.ts             # POST: registro de usuarios
│  ├─ signIn/  register/                # inicio de sesión y registro
│  ├─ dashboard/  profile/              # páginas protegidas
│  └─ layout.tsx  page.tsx
├─ components/                          # SessionProvider, Navbar, LogoutButton, formularios, botones OAuth
├─ lib/
│  ├─ auth.ts                           # authOptions (Google, GitHub, Credentials)
│  ├─ credentials.ts                    # validación, bcrypt y bloqueo por intentos
│  └─ users.ts                          # almacén de usuarios (JSON local / PostgreSQL)
├─ proxy.ts                             # protege /dashboard y /profile
└─ types/next-auth.d.ts
```

## Pantallas y endpoints

| Ruta | Descripción |
| --- | --- |
| `/` | Redirige a `/dashboard` |
| `/signIn` | Formulario de credenciales + Google + GitHub |
| `/register` | Formulario de registro |
| `/dashboard`, `/profile` | Protegidas: sin sesión redirigen a `/signIn` |
| `POST /api/register` | Crea la cuenta (400 datos inválidos, 409 correo repetido, 201 creada) |
| `/api/auth/*` | Rutas de NextAuth |

## Diseño

Interfaz en azul cobalto y blanco con tipografía cinética hecha solo con CSS (sin librerías de animación):

- Titulares cuyas letras suben una a una (`KineticLine`) y reaccionan al cursor.
- Franjas de texto que corren sin fin (`Marquee`) y botones con texto que rueda al pasar el cursor (`RollText`).
- Solo se animan `transform` y `opacity`; los efectos de cursor se activan únicamente con puntero fino (`hover: hover`).
- Con `prefers-reduced-motion` las letras solo aparecen (sin desplazamiento) y las franjas se detienen.

## Seguridad de las credenciales

- Contraseñas con `bcryptjs` (12 rondas); nunca se guardan ni se devuelven en claro.
- Política: 8–72 caracteres con letras y números (bcrypt solo procesa 72 bytes).
- Bloqueo: tras **5 intentos fallidos seguidos** la cuenta se bloquea **15 minutos**; un acceso correcto reinicia el contador.
- Un correo inexistente y una contraseña errónea dan el mismo mensaje y tardan lo mismo (hash de relleno).
- Sesión con JWT firmado con `NEXTAUTH_SECRET`; la protección de rutas combina `proxy.ts` y `getServerSession` en cada página.

## Cómo probar

1. `npm run dev` y abrir http://localhost:3000 (redirige a `/signIn`).
2. Crear una cuenta en `/register`; entra directo al dashboard.
3. Cerrar sesión e ingresar con una contraseña incorrecta 5 veces: a la quinta aparece el mensaje de cuenta bloqueada, incluso con la contraseña correcta.
4. Probar «Continuar con Google» y «Continuar con GitHub».

## Despliegue en Vercel

1. Importar el repositorio en Vercel.
2. Crear una base PostgreSQL (Marketplace → Neon) que inyecte `DATABASE_URL`. Sin ella el registro no persiste (el disco de Vercel es efímero).
3. Definir `NEXTAUTH_URL` (URL del despliegue), `NEXTAUTH_SECRET`, `GOOGLE_*` y `GITHUB_*`.
4. Agregar `https://<tu-app>.vercel.app/api/auth/callback/google` y `/github` en cada proveedor.

## Desviaciones respecto al enunciado

- **Next.js 16**: `middleware.ts` se llama ahora `proxy.ts`; mismo comportamiento con `next-auth/middleware`.
- **`cacheComponents` activo**: las páginas que leen la sesión se envuelven en `<Suspense>`.
- **Imágenes remotas**: `next.config.ts` usa `images.remotePatterns` (en lugar de `domains`, en desuso) para Google y GitHub.
- **Estructura**: `authOptions` vive en `src/lib/auth.ts` y no se exporta desde `route.ts` (Next.js no permite exportar otros nombres desde un route handler).
- **Home**: `/` redirige a `/dashboard` como en el enunciado; el proxy lo envía a `/signIn` si no hay sesión.
- **Secretos**: el documento muestra credenciales reales de Google en capturas; no se reutilizan, cada entorno usa las suyas en `.env.local`.
