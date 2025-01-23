const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Importar bcrypt para encriptar contraseñas
const Usuario = require('./models/usuario'); // Importar el modelo de usuario

const app = express();
const PORT = 3000; // Puedes cambiar el puerto si lo necesitas

// Middleware para servir archivos estáticos desde 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear el cuerpo de las peticiones POST (especialmente para JSON)
app.use(bodyParser.json());

// Conexión a MongoDB

    mongoose.connect('mongodb+srv://jgasfdvassm:<db_password>@mi-cluster-web.w00z5.mongodb.net/?retryWrites=true&w=majority&appName=mi-cluster-web', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Conectado a MongoDB Atlas"))
    .catch(err => console.log("Error de conexión a MongoDB Atlas", err));
// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para manejar el registro de usuarios
app.post('/register', async (req, res) => {
    const { nombre, correo, contrasena } = req.body;

    try {
        // Encriptar contraseña antes de guardarla
        const hash = await bcrypt.hash(contrasena, 10);

        // Crear un nuevo usuario con la contraseña encriptada
        const nuevoUsuario = new Usuario({ nombre, correo, contrasena: hash });

        // Guardar el usuario en la base de datos
        await nuevoUsuario.save();

        res.status(201).send('Usuario registrado exitosamente');
    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        if (err.code === 11000) {
            res.status(400).send('El correo ya está registrado');
        } else {
            res.status(400).send('Error al registrar el usuario: ' + err.message);
        }
    }
});

// Ruta para manejar el inicio de sesión
app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const esValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!esValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso', redirectTo: '/inicio.html' });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Escuchar el servidor en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});