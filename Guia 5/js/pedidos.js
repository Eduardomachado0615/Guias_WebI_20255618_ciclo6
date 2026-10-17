// Arreglo principal que almacena los pedidos
let pedidos = [];

// Selección de elementos del DOM
const formPedido = document.querySelector("#formPedido");
const txtProducto = document.querySelector("#txtProducto");
const txtPrecio = document.querySelector("#txtPrecio");
const txtCantidad = document.querySelector("#txtCantidad");
const txtPrecioMax = document.querySelector("#txtPrecioMax");

const btnFiltrar = document.querySelector("#btnFiltrar");
const btnMostrarTodos = document.querySelector("#btnMostrarTodos");
const btnLimpiar = document.querySelector("#btnLimpiar");

const tbodyPedidos = document.querySelector("#idTablaPedidos");
const lblTotalUnidades = document.querySelector("#lblTotalUnidades");
const lblMontoTotal = document.querySelector("#lblMontoTotal");

// ==========================================
// 1. GESTIÓN DE EVENTOS (addEventListener)
// ==========================================
formPedido.addEventListener("submit", (e) => {
    e.preventDefault();
    agregarPedido();
});

btnFiltrar.addEventListener("click", () => {
    let precioMax = parseFloat(txtPrecioMax.value);
    if (isNaN(precioMax) || precioMax < 0) {
        alert("Por favor, ingrese un precio máximo válido para filtrar.");
        return;
    }
    filtrarPedidos(precioMax);
});

btnMostrarTodos.addEventListener("click", () => {
    renderizarTabla(pedidos);
    actualizarTotales(pedidos);
    txtPrecioMax.value = "";
});

btnLimpiar.addEventListener("click", () => {
    limpiarPedidos();
});

// ==========================================
// 2. LÓGICA Y PROCESAMIENTO DE DATOS
// ==========================================
function agregarPedido() {
    let producto = txtProducto.value.trim();
    let precio = parseFloat(txtPrecio.value);
    let cantidad = parseInt(txtCantidad.value);

    // Validaciones estrictas (Requerimiento 3)
    if (producto === "") {
        alert("El nombre del producto no puede estar vacío.");
        return;
    }
    if (isNaN(precio) || precio <= 0) {
        alert("El precio unitario debe ser mayor a cero.");
        return;
    }
    if (isNaN(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)) {
        alert("La cantidad debe ser un número entero positivo.");
        return;
    }

    // Crear el objeto y agregarlo al arreglo (Requerimiento 2 y 4)
    const nuevoPedido = { producto, precio, cantidad };
    pedidos.push(nuevoPedido);

    // Actualizar interfaz
    renderizarTabla(pedidos);
    actualizarTotales(pedidos);

    // Limpiar formulario
    formPedido.reset();
    txtProducto.focus();
}

function filtrarPedidos(precioMax) {
    // Uso del método funcional filter() sin alterar el arreglo original (Requerimiento 6 y 10)
    const pedidosFiltrados = pedidos.filter(p => p.precio <= precioMax);
    renderizarTabla(pedidosFiltrados);
    actualizarTotales(pedidosFiltrados);
}

function limpiarPedidos() {
    pedidos = [];
    renderizarTabla(pedidos);
    actualizarTotales(pedidos);
    txtPrecioMax.value = "";
}

// ==========================================
// 3. ACTUALIZACIÓN DEL DOM Y PROGRAMACIÓN FUNCIONAL
// ==========================================
function renderizarTabla(listaPedidos) {
    // Uso del método funcional map() para transformar objetos en etiquetas HTML <tr> (Requerimiento 10)
    const filasHTML = listaPedidos.map(p => {
        let subtotal = p.precio * p.cantidad;
        return `
            <tr>
                <td>${p.producto}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.cantidad}</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
        `;
    }).join("");

    tbodyPedidos.innerHTML = filasHTML;
}

function actualizarTotales(listaPedidos) {
    // Uso del método funcional reduce() para calcular totales sin ciclos tradicionales (Requerimiento 5 y 10)
    const totalUnidades = listaPedidos.reduce((acumulador, p) => acumulador + p.cantidad, 0);
    const montoTotal = listaPedidos.reduce((acumulador, p) => acumulador + (p.precio * p.cantidad), 0);

    lblTotalUnidades.textContent = totalUnidades;
    lblMontoTotal.textContent = montoTotal.toFixed(2);
}