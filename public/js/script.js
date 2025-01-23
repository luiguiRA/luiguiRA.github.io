
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6; // Mínimo 6 caracteres
}

// Mostrar mensajes de notificación
function showMessage(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Registro de usuarios
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('signup-name').value.trim();
    const correo = document.getElementById('signup-email').value.trim();
    const contrasena = document.getElementById('signup-password').value;

    // Validar campos
    if (!nombre || !validateEmail(correo) || !validatePassword(contrasena)) {
        showMessage('error', 'Por favor, completa todos los campos correctamente.');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, correo, contrasena }),
        });

        if (response.ok) {
            showMessage('success', 'Usuario registrado exitosamente.');
        } else {
            const message = await response.text();
            showMessage('error', 'Hubo un problema con el registro: ' + message);
        }
    } catch (err) {
        showMessage('error', 'Error en la solicitud: ' + err.message);
    }
});

// Inicio de sesión
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = document.getElementById('login-email').value.trim();
    const contrasena = document.getElementById('login-password').value;

    // Validar campos
    if (!validateEmail(correo) || !validatePassword(contrasena)) {
        showMessage('error', 'Por favor, completa todos los campos correctamente.');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, contrasena }),
        });

        if (response.ok) {
            showMessage('success', 'Inicio de sesión exitoso.');
            const data = await response.json();
            window.location.href = data.redirectTo; // Redirigir
        } else {
            const message = await response.text();
            showMessage('error', 'Hubo un problema con el inicio: ' + message);
        }
    } catch (err) {
        showMessage('error', 'Error en la solicitud: ' + err.message);
    }
});

var map;
var marker; // El marcador será creado y actualizado solo con la geolocalización.

// Función para abrir el modal de ubicación y obtener la ubicación real
function openLocationModal() {
    // Desenfocar el fondo
    document.body.classList.add('modal-open');
    document.getElementById('locationModal').classList.add('show');

    // Verificar si la geolocalización está disponible
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            // Si el mapa ya está inicializado, no lo inicializamos nuevamente
            if (!map) {
                map = L.map('map').setView([lat, lon], 13); // Crear el mapa solo si no está inicializado

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Crear un marcador en la ubicación real
                marker = L.marker([lat, lon]).addTo(map);
                marker.bindPopup("<b>Tu ubicación</b>").openPopup();
            } else {
                // Si el mapa ya existe, solo actualizamos la vista y el marcador
                map.setView([lat, lon], 13);
                if (marker) { // Verificar si el marcador existe antes de moverlo
                    marker.setLatLng([lat, lon]);
                }
            }

        }, function(error) {
            alert("No se pudo obtener la ubicación: " + error.message);
        });
    } else {
        alert("La geolocalización no está disponible en este navegador.");
    }
}

// Función para cerrar el modal
function closeLocationModal() {
    // Restaurar el fondo
    document.body.classList.remove('modal-open');
    document.getElementById('locationModal').classList.remove('show');
}

// Función para confirmar la ubicación
function confirmLocation() {
    // Verificar si el marcador está definido
    if (marker) {
        var latLng = marker.getLatLng();
        //alert("Ubicación confirmada: " + latLng.lat + ", " + latLng.lng);
        alert("UBICACIÓN CONFIRMADA");
        // Cerrar el modal
        closeLocationModal();
    } else {
        alert("No se ha seleccionado una ubicación.");
    }
}
