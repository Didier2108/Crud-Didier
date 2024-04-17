const baseURL = 'http://127.0.0.1:8000/usuarios'

function cargarUsuarios() {
    axios.get(baseURL)
        .then(response => {
            const usuarios = response.data;
            const listaUsuarios = document.getElementById('usuarios-lista');
            listaUsuarios.innerHTML = ''; // Limpiar la lista antes de agregar usuarios
            usuarios.forEach(usuario => {
                const row = listaUsuarios.insertRow(); // Insertar una nueva fila en la tabla
                row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.plataforma}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.password}</td>
                    <td><button onclick="editarUsuario(${usuario.id})" class="btn border-warning btn-sm">✏️</button></td>
                    <td><button onclick="eliminarUsuario(${usuario.id})" class="btn border-danger btn-sm">🗑️</button></td>
                `;
            });
        })
        .catch(error => {
            console.error('Error al cargar usuarios:', error);
        });
}

// Event listener para el envío del formulario de agregar usuario
document.getElementById('button').addEventListener('click', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de manera predeterminada

    const plataforma = document.getElementById('plataforma').value;
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    axios.post(baseURL, { plataforma, correo, password })
        .then(response => {
            console.log('Usuario agregado:', response.data);
            cargarUsuarios(); // Volver a cargar la lista de usuarios después de agregar uno nuevo
        })
        .catch(error => {
            console.error('Error al agregar usuario:', error);
        });
});


// Event listener para el envío del formulario de agregar usuario
document.getElementById('button').addEventListener('click', enviarFormulario);

function enviarFormulario(event) {
    event.preventDefault();
    // Obtener los valores del formulario
    const plataforma = document.getElementById('plataforma').value;
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;
    // Verificar si el botón es para crear o actualizar
    const button = document.getElementById('button');
    if (button.textContent === 'Actualizar') {
        // Si el botón es para actualizar, obtener el ID del usuario seleccionado
        const usuarioId = button.dataset.usuarioId;
        actualizarUsuario(usuarioId, plataforma, correo, password);
    } else {
        // Si el botón es para crear, realizar una solicitud POST para crear un nuevo usuario
        axios.post(baseURL, { plataforma, correo, password })
            .then(response => {
                console.log('Usuario creado:', response.data);
                cargarUsuarios();
            })
            .catch(error => {
                console.error('Error al crear usuario:', error);
            });
    }
}

function editarUsuario(usuarioId) {
    // Obtener los datos del usuario a editar
    axios.get(`${baseURL}/${usuarioId}`)
        .then(response => {
            const usuario = response.data;
            // Asignar los valores del usuario al formulario
            document.getElementById('plataforma').value = usuario.plataforma;
            document.getElementById('correo').value = usuario.correo;
            document.getElementById('password').value = usuario.password;
            // Cambiar el texto del botón a "Actualizar" y almacenar el ID del usuario en el atributo de datos
            const button = document.getElementById('button');
            button.textContent = 'Actualizar';
            button.dataset.usuarioId = usuarioId;
        })
        .catch(error => {
            console.error('Error al obtener usuario para editar:', error);
        });
}

function actualizarUsuario(usuarioId, plataforma, correo, password) {
    // Realizar una solicitud PUT para actualizar el usuario
    axios.put(`${baseURL}/${usuarioId}`, { plataforma, correo, password })
        .then(response => {
            console.log('Usuario actualizado:', response.data);
            cargarUsuarios();
            // Restaurar el botón de "Crear" y limpiar los campos del formulario
            const button = document.getElementById('button');
            button.textContent = 'Crear';
            button.removeAttribute('data-usuario-id');
            document.getElementById('plataforma').value = '';
            document.getElementById('correo').value = '';
            document.getElementById('password').value = '';
        })
        .catch(error => {
            console.error('Error al actualizar usuario:', error);
        });
}

function eliminarUsuario(usuarioId) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        axios.delete(`${baseURL}/${usuarioId}`)
            .then(response => {
                console.log('Usuario eliminado correctamente');
                cargarUsuarios(); // Volver a cargar la lista de usuarios después de eliminar uno
            })
            .catch(error => {
                console.error('Error al eliminar usuario:', error);
            });
    }
}

// Llamar a la función para cargar la lista de usuarios al cargar la página
cargarUsuarios();