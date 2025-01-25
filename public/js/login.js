// Función para registrar un nuevo usuario
function signUp(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Verificar si el usuario ya está registrado
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Crear un nuevo objeto de usuario
    const newUser = { name, email, password };

    // Verificar si el email ya está registrado
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert('Este correo ya está registrado');
        return;
    }

    // Guardar el nuevo usuario en el localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Usuario registrado con éxito');
    document.getElementById('signup-form').reset();
}

// Función para iniciar sesión
function logIn(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Buscar si el usuario existe y si la contraseña es correcta
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert('Inicio de sesión exitoso');
        // Redirigir a la página principal o a donde quieras
        window.location.href = 'inicio.html';  // Cambiar a tu página de inicio
    } else {
        alert('Correo o contraseña incorrectos');
    }
}

// Asignar las funciones a los formularios
document.getElementById('signup-form').addEventListener('submit', signUp);
document.getElementById('login-form').addEventListener('submit', logIn);
