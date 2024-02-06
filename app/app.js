const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const routes = require('./router/routes');
const server = http.createServer(app);
const io = socketIO(server);

// Configuración de express-session
app.use(session({
    secret: 'Pa55w0rD1234',
    resave: true,
    saveUninitialized: true
}));

// Middleware para hacer que io esté disponible en los controladores
app.use((req, res, next) => {
    req.app = { io };
    next();
});

// Configura las rutas
app.use('/', routes);

// Configura el cliente HTML estático
app.use(express.static(__dirname + '/public'));

let contadorGlobal = 0;

// Configuración de Socket.IO
io.on('connection', (socket) => {
    // Envía el valor actual del contador cuando un nuevo cliente se conecta
    socket.emit('contador', contadorGlobal || 0);
  
    // Escucha eventos de generación de guía y actualiza el contador
    socket.on('generarGuia', () => {
      contadorGlobal++;
      // Envía el nuevo valor del contador a todos los clientes conectados
      io.emit('contador', contadorGlobal);
    });
});

// Inicia el servidor
require('dotenv').config({
    path: path.join(__dirname, './.env')
})
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
