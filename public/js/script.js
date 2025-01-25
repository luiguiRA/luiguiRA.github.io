
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
//anuncio flash
// Mostrar el modal al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const popupModal = document.getElementById('popupModal');
    popupModal.style.display = 'flex'; // Muestra el modal
});

// Función para cerrar el modal
function closePopupModal() {
    const popupModal = document.getElementById('popupModal');
    popupModal.style.display = 'none'; // Oculta el modal
}

var map;
var marker; // El marcador será creado y actualizado solo con la geolocalización.
var selectedLocation = "No seleccionada"; // Variable para guardar la ubicación confirmada

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

// Función para confirmar la ubicación y convertir las coordenadas en una ciudad
function confirmLocation() {
    // Verificar si el marcador está definido
    if (marker) {
        var latLng = marker.getLatLng();

        // Solicitar a la API de Nominatim la dirección para las coordenadas
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latLng.lat}&lon=${latLng.lng}&format=json`)
            .then(response => response.json())
            .then(data => {
                if (data && data.address) {
                    // Obtener la ciudad (o el lugar más cercano)
                    const city = data.address.city || data.address.town || data.address.village || "Ubicación no disponible";
                    selectedLocation = city; // Guardar la ciudad o ubicación
                    // Mostrar la ubicación confirmada en el DOM
                    document.getElementById("user-location").innerHTML = `<strong>Ubicación:</strong> ${selectedLocation}`;
                    alert("Ubicación confirmada: " + selectedLocation);
                } else {
                    alert("No se pudo obtener la dirección.");
                }
                // Cerrar el modal
                closeLocationModal();
            })
            .catch(error => {
                console.error('Error al obtener la dirección:', error);
                alert("No se pudo obtener la dirección.");
            });
    } else {
        alert("No se ha seleccionado una ubicación.");
    }
}
