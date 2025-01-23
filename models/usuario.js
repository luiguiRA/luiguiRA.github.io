const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Por favor ingresa un correo válido'],
    },
    contrasena: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
