# Bolu-Chat 🇦🇷 Proyecto Backend 😜😎

Este proyecto es el backend de una aplicación de chat en tiempo real utilizando lenguajes y herramientas como:
**Node.js**, **Express**, **Socket.IO**, **MySQL**, **JWT**


---

## 🚀 Instalación

1. Cloná el repositorio:

```bash
git clone https://github.com/TorricoFranco/Bolu-Chat
```
2. En la raíz del proyecto
```
npm install
```
4. Accedé a la carpeta del backend:
```
cd backend
```
4. Instalá las dependencias:
```
npm install
```
5. Inicia el servidor en modo desarrollo
```           
npm run dev
```

##📌 Puntos Clave del Proyecto

🔐 Registro e inicio de sesión de usuarios

🛡️ Autenticación segura utilizando JWT (JSON Web Tokens) y cookies HTTP-only

🔑 Cifrado de contraseñas con bcrypt

♻️ Manejo de refresh tokens para mantener la sesión activa

💳 Integración con Mercado Pago como pasarela de pagos para apoyar al desarrollador 😁

💬 Chat grupal en tiempo real mediante comunicación bidireccional con Socket.IO

⚙️ Manejo completo de eventos de socket, incluyendo:

* Usuarios conectados y desconectados

* Envío y guardado de mensajes

* Envío de imagen de perfil

🖼️ Carga y almacenamiento de imágenes de perfil como archivos estáticos

⚡ Optimización de imágenes con sharp y gestión con multer

🧱 Arquitectura basada en patrón MVC (Modelo-Vista-Controlador)

📈 Diseñado para escalabilidad del backend

🗄️ Consultas SQL utilizando la librería mysql2 con promesas

📄 Documentación de los Endpoint con Swagger Open Api 3.0

## Documentación de la API

La documentación de la API se realizó con **Swagger**, está disponible en **modo development**.  
Para verla, ejecuta el proyecto en entorno de desarrollo y accede a:

[http://localhost:9999/api-docs](http://localhost:9999/api-docs)  

> ⚠️ En producción, la documentación no estará accesible.


# Tests del proyecto

Este proyecto usa **Jest** para pruebas unitarias e integración, incluyendo simulaciones de **Socket.IO** y middlewares.


### 1. Unitarios
Prueban funciones o middlewares aislados usando **mocks** de dependencias externas.

- **`middleware/authMiddleware.test.js`** – Middleware de autenticación JWT.
- **`middleware/uploadImageMiddleware.test.js`** – Subida de imágenes usando `sharp`.
- **`controllers/auth-user.controller.test.js`** – Registro, login y logout de usuarios.
- **`controllers/chat.controller.test.js`** – Controlador de chat: carga de páginas, subida de imágenes.
- **`socket/events/onBatchMessages.test.js`** – Evento `batch messages`: valida que el servidor emita correctamente los mensajes en lote desde la DB mockeada.
- **`socket/events/onChatMessage.test.js`** – Evento `chat message`: valida envío, almacenamiento y emisión de mensajes de chat entre clientes.
- **`socket/events/onConnect.test.js`** – Evento `connect`: valida adición de usuario, emisión de `users-online` y notificación de conexión a otros clientes.
- **`socket/events/onDisconnect.test.js`** – Evento `disconnect`: valida eliminación de usuario y actualización de `users-online` al desconectarse un cliente.

### 2. Integración

- **`socket/socketIntegration.test.js`** – Varios clientes conectan a un servidor real y envían mensajes globales. Valida eventos: `chat message`, `count-message`, `batch messages`.
- **`socket/handleSocketConnection.test.js`** – Test de integración del manejador de sockets (`handleSocketConnection`). Verifica conexión, mensajes y desconexión (`users-online`).
- **`socket/multiConnectionBasic.test.js`** – Conexión múltiple de clientes a un servidor Socket.IO real. Se puede probar con diferente cantidad de usuarios usando la variable de entorno `NUM_CLIENTS`.

## Ejecutar los tests

```bash
# Ejecuta todos los tests
npm run test

# Ejecuta un test específico
npx jest --runInBand --detectOpenHandles nombreDelTest.test.js

# Ejemplo con varios clientes para el test de conexión múltiple
$env:NUM_CLIENTS=10; npm run test multiConnectionBasic.test.js




## 🚧 Próximamente

🔐 Inicio de sesión con Google

🏠 Chats privados entre usuarios mediante salas (Rooms) en Socket.IO




