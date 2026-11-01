// Obtener elementos del DOM
let pacientes = [];
const tablaPacientes = document.getElementById("cuerpoTablaPacientes"); // ID según tu estructura
const formPaciente = document.getElementById("formPaciente");

// 1. Cargar datos almacenados al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    obtenerLocalStorage();
});

// Función para obtener los datos de LocalStorage
function obtenerLocalStorage() {
    let datos = localStorage.getItem("pacientes");
    if (datos) {
        pacientes = JSON.parse(datos);
    } else {
        pacientes = [];
    }
    mostrarPacientes();
}

// Función para guardar en LocalStorage
function guardarLocalStorage() {
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
}

// 2. Función para mostrar los pacientes en la tabla HTML
function mostrarPacientes() {
    tablaPacientes.innerHTML = "";
    pacientes.forEach((paciente, index) => {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${paciente.nombre}</td>
            <td>${paciente.apellido}</td>
            <td>${paciente.fechaNacimiento}</td>
            <td>${paciente.sexo}</td>
            <td>${paciente.telefono}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="cargarEdicion(${index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPaciente(${index})">Eliminar</button>
            </td>
        `;
        tablaPacientes.appendChild(fila);
    });
}

// 3. Función para Eliminar un paciente
function eliminarPaciente(index) {
    if (confirm("¿Está seguro de que desea eliminar este registro?")) {
        pacientes.splice(index, 1); // Elimina el elemento del arreglo
        guardarLocalStorage();      // Actualiza LocalStorage
        mostrarPacientes();       // Refresca la tabla
    }
}

// 4. Función para Editar un paciente (carga los datos en el formulario para modificarlos)
let indiceEdicion = null;

function cargarEdicion(index) {
    indiceEdicion = index;
    let paciente = pacientes[index];
    
    // Rellenar los campos del formulario con los datos actuales
    document.getElementById("nombre").value = paciente.nombre;
    document.getElementById("apellido").value = paciente.apellido;
    document.getElementById("fechaNacimiento").value = paciente.fechaNacimiento;
    document.getElementById("sexo").value = paciente.sexo;
    document.getElementById("telefono").value = paciente.telefono;

    // Cambiar texto del botón de guardar a actualizar si es necesario
    document.getElementById("btnGuardar").innerText = "Actualizar";
}

// Función para Guardar o Actualizar el registro
function guardarPaciente(event) {
    event.preventDefault();
    
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const sexo = document.getElementById("sexo").value;
    const telefono = document.getElementById("telefono").value;

    const objetoPaciente = { nombre, apellido, fechaNacimiento, sexo, telefono };

    if (indiceEdicion === null) {
        // Crear nuevo registro
        pacientes.push(objetoPaciente);
    } else {
        // Actualizar registro existente
        pacientes[indiceEdicion] = objetoPaciente;
        indiceEdicion = null;
        document.getElementById("btnGuardar").innerText = "Guardar";
    }

    guardarLocalStorage();
    mostrarPacientes();
    formPaciente.reset();
}

if (formPaciente) {
    formPaciente.addEventListener("submit", guardarPaciente);
}