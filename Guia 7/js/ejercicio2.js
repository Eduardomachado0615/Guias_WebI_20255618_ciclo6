/* =====================================================================
   EJERCICIO 2: Consumiendo una API de RapidAPI con Fetch API

   API utilizada: Free-to-Play Games Database (plan gratuito)
   Endpoint 1 (listado): GET /api/games  -> coleccion de juegos
   Endpoint 2 (detalle): GET /api/game?id={id} -> ficha de un juego
   ===================================================================== */

const API_HOST = "free-to-play-games-database.p.rapidapi.com";
const API_URL = `https://${API_HOST}/api`;

// Opcional: puede pegar su clave aqui. Si el proyecto se sube a GitHub es mejor
// dejarla vacia y guardarla desde el boton "API key" (queda solo en su navegador).
const API_KEY_POR_DEFECTO = "";

const CLAVE_STORAGE = "guia7_rapidapi_key";
const JUEGOS_POR_PAGINA = 12;

// ---------------------------------------------------------------------
// Referencias a elementos HTML
// ---------------------------------------------------------------------
const formFiltros = document.getElementById("idFormFiltros");
const selPlataforma = document.getElementById("idPlataforma");
const selCategoria = document.getElementById("idCategoria");
const selOrden = document.getElementById("idOrden");
const btnBuscar = document.getElementById("idBtnBuscar");
const inputTitulo = document.getElementById("idBuscarTitulo");
const estado = document.getElementById("idEstado");
const listado = document.getElementById("idListado");
const btnMas = document.getElementById("idBtnMas");
const btnApiKey = document.getElementById("idBtnApiKey");
const inputKey = document.getElementById("idInputKey");
const btnGuardarKey = document.getElementById("idBtnGuardarKey");
const btnQuitarKey = document.getElementById("idBtnQuitarKey");
const tituloDetalle = document.getElementById("idTituloDetalle");
const cuerpoDetalle = document.getElementById("idCuerpoDetalle");

const modalDetalle = new bootstrap.Modal(document.getElementById("idModalDetalle"), {});
const modalKey = new bootstrap.Modal(document.getElementById("idModalKey"), {});

// ---------------------------------------------------------------------
// Estado de la aplicacion
// ---------------------------------------------------------------------
let juegos = []; // todos los juegos devueltos por la API
let juegosFiltrados = []; // juegos que coinciden con la busqueda por titulo
let mostrados = 0; // cuantas tarjetas hay en pantalla
let peticionActual = 0; // evita que una respuesta vieja pise a una nueva
let detalleActual = null; // id del juego cuyo detalle se esta mostrando
const detallesEnCache = new Map(); // detalles ya consultados (ahorra solicitudes)

// ---------------------------------------------------------------------
// Utilidades del DOM
// ---------------------------------------------------------------------
const crear = function (etiqueta, clases, texto) {
  const nodo = document.createElement(etiqueta);
  if (clases) {
    nodo.setAttribute("class", clases);
  }
  if (texto !== undefined && texto !== null) {
    nodo.appendChild(document.createTextNode(texto));
  }
  return nodo;
};

const vaciar = function (nodo) {
  while (nodo.firstChild) {
    nodo.removeChild(nodo.firstChild);
  }
};

const crearCargando = function (mensaje) {
  const caja = crear(
    "div",
    "d-flex align-items-center justify-content-center gap-3 py-5 text-secondary"
  );
  const spinner = crear("div", "spinner-border text-primary");
  spinner.setAttribute("role", "status");
  caja.appendChild(spinner);
  caja.appendChild(crear("span", "fs-5", mensaje));
  return caja;
};

const crearAlerta = function (tipo, mensaje) {
  const alerta = crear("div", `alert alert-${tipo} mb-0`, mensaje);
  alerta.setAttribute("role", "alert");
  return alerta;
};

// ---------------------------------------------------------------------
// Clave de la API (se guarda en el navegador, no en el codigo)
// ---------------------------------------------------------------------
const leerApiKey = function () {
  try {
    return localStorage.getItem(CLAVE_STORAGE) || API_KEY_POR_DEFECTO;
  } catch (error) {
    return API_KEY_POR_DEFECTO;
  }
};

const guardarApiKey = function (clave) {
  try {
    localStorage.setItem(CLAVE_STORAGE, clave);
  } catch (error) {
    console.warn("No se pudo guardar la clave en el navegador", error);
  }
};

const borrarApiKey = function () {
  try {
    localStorage.removeItem(CLAVE_STORAGE);
  } catch (error) {
    console.warn("No se pudo borrar la clave del navegador", error);
  }
};

// ---------------------------------------------------------------------
// Consumo de la API con Fetch + async/await y manejo de errores
// ---------------------------------------------------------------------
class ErrorApi extends Error {
  constructor(mensaje, tipo, codigo) {
    super(mensaje);
    this.tipo = tipo; // "sin-key" | "red" | "http" | "formato"
    this.codigo = codigo; // codigo HTTP (si aplica)
  }
}

const mensajeSegunEstado = function (codigo) {
  if (codigo === 401 || codigo === 403) {
    return "La API key no es válida o su cuenta no está suscrita al plan gratuito de esta API.";
  }
  if (codigo === 404) {
    return "No se encontró el recurso solicitado.";
  }
  if (codigo === 429) {
    return "Se alcanzó el límite de solicitudes del plan gratuito. Espere un momento e intente de nuevo.";
  }
  if (codigo >= 500) {
    return "El servicio no está disponible en este momento. Intente más tarde.";
  }
  return `La solicitud no se pudo completar (error ${codigo}).`;
};

const consultarApi = async function (ruta, parametros = {}) {
  const apiKey = leerApiKey();
  if (!apiKey) {
    throw new ErrorApi(
      "Para ver los juegos necesita configurar su API key de RapidAPI.",
      "sin-key"
    );
  }

  const url = new URL(API_URL + ruta);
  Object.entries(parametros).forEach(function ([nombre, valor]) {
    if (valor) {
      url.searchParams.set(nombre, valor);
    }
  });

  let respuesta;
  try {
    respuesta = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": API_HOST,
      },
    });
  } catch (error) {
    throw new ErrorApi(
      "No fue posible conectar con el servicio. Revise su conexión a internet e intente de nuevo.",
      "red"
    );
  }

  if (!respuesta.ok) {
    throw new ErrorApi(mensajeSegunEstado(respuesta.status), "http", respuesta.status);
  }

  try {
    return await respuesta.json();
  } catch (error) {
    throw new ErrorApi("La respuesta del servicio no tiene el formato esperado.", "formato");
  }
};

// ---------------------------------------------------------------------
// Mensajes de estado
// ---------------------------------------------------------------------
const mostrarError = function (error) {
  vaciar(estado);
  const alerta = crearAlerta(error.tipo === "sin-key" ? "warning" : "danger", error.message);

  const acciones = crear("div", "mt-3 d-flex gap-2");
  if (error.tipo === "sin-key" || error.codigo === 401 || error.codigo === 403) {
    const botonKey = crear("button", "btn btn-sm btn-dark", "Configurar API key");
    botonKey.type = "button";
    botonKey.addEventListener("click", abrirModalKey);
    acciones.appendChild(botonKey);
  }
  if (error.tipo !== "sin-key") {
    const botonReintentar = crear("button", "btn btn-sm btn-outline-dark", "Reintentar");
    botonReintentar.type = "button";
    botonReintentar.addEventListener("click", cargarJuegos);
    acciones.appendChild(botonReintentar);
  }
  alerta.appendChild(acciones);
  estado.appendChild(alerta);
};

const actualizarResumen = function () {
  vaciar(estado);
  estado.appendChild(
    crear(
      "p",
      "text-secondary",
      `Mostrando ${mostrados} de ${juegosFiltrados.length} juegos.`
    )
  );
};

// ---------------------------------------------------------------------
// ENDPOINT 1: listado de juegos
// ---------------------------------------------------------------------
const crearTarjeta = function (juego) {
  const columna = crear("div", "col");
  const tarjeta = crear("div", "card h-100 shadow-sm");

  const imagen = crear("img", "card-img-top juego-miniatura");
  imagen.setAttribute("src", juego.thumbnail);
  imagen.setAttribute("alt", `Portada de ${juego.title}`);
  imagen.setAttribute("loading", "lazy");

  const cuerpo = crear("div", "card-body d-flex flex-column");
  cuerpo.appendChild(crear("h2", "card-title h5", juego.title));

  const etiquetas = crear("div", "mb-2");
  etiquetas.appendChild(crear("span", "badge text-bg-primary me-1", juego.genre));
  etiquetas.appendChild(crear("span", "badge text-bg-secondary", juego.platform));
  cuerpo.appendChild(etiquetas);

  cuerpo.appendChild(crear("p", "card-text small text-secondary", juego.short_description));

  const boton = crear("button", "btn btn-outline-primary mt-auto", "Ver detalles");
  boton.type = "button";
  boton.addEventListener("click", function () {
    verDetalle(juego.id, juego.title);
  });
  cuerpo.appendChild(boton);

  tarjeta.appendChild(imagen);
  tarjeta.appendChild(cuerpo);
  columna.appendChild(tarjeta);
  return columna;
};

const mostrarMas = function () {
  const hasta = Math.min(mostrados + JUEGOS_POR_PAGINA, juegosFiltrados.length);
  for (let i = mostrados; i < hasta; i++) {
    listado.appendChild(crearTarjeta(juegosFiltrados[i]));
  }
  mostrados = hasta;
  actualizarResumen();
  btnMas.classList.toggle("d-none", mostrados >= juegosFiltrados.length);
};

const aplicarBusqueda = function () {
  const texto = inputTitulo.value.trim().toLowerCase();
  juegosFiltrados = juegos.filter(function (juego) {
    return juego.title.toLowerCase().includes(texto);
  });

  vaciar(listado);
  mostrados = 0;

  if (juegosFiltrados.length === 0) {
    vaciar(estado);
    estado.appendChild(
      crearAlerta("info", `Ningún juego coincide con «${inputTitulo.value.trim()}».`)
    );
    btnMas.classList.add("d-none");
    return;
  }
  mostrarMas();
};

const cargarJuegos = async function () {
  const numeroPeticion = ++peticionActual;

  vaciar(listado);
  btnMas.classList.add("d-none");
  inputTitulo.value = "";
  inputTitulo.disabled = true;
  btnBuscar.disabled = true;
  vaciar(estado);
  estado.appendChild(crearCargando("Cargando juegos..."));

  try {
    const datos = await consultarApi("/games", {
      platform: selPlataforma.value,
      category: selCategoria.value,
      "sort-by": selOrden.value,
    });
    if (numeroPeticion !== peticionActual) {
      return; // ya se pidio otra lista mas reciente
    }

    // Cuando no hay resultados la API devuelve un objeto con un mensaje, no un arreglo
    juegos = Array.isArray(datos) ? datos : [];

    if (juegos.length === 0) {
      vaciar(estado);
      estado.appendChild(
        crearAlerta("info", "No se encontraron juegos con esos filtros. Pruebe con otra combinación.")
      );
      return;
    }

    inputTitulo.disabled = false;
    aplicarBusqueda();
  } catch (error) {
    if (numeroPeticion !== peticionActual) {
      return;
    }
    juegos = [];
    mostrarError(error);
  } finally {
    if (numeroPeticion === peticionActual) {
      btnBuscar.disabled = false;
    }
  }
};

// ---------------------------------------------------------------------
// ENDPOINT 2: detalle de un juego (sin recargar la pagina)
// ---------------------------------------------------------------------
const formatearFecha = function (texto) {
  if (!texto) {
    return "—";
  }
  const fecha = new Date(`${texto}T00:00:00`);
  if (isNaN(fecha)) {
    return texto;
  }
  return fecha.toLocaleDateString("es-SV", { day: "numeric", month: "long", year: "numeric" });
};

const mostrarDetalle = function (detalle) {
  vaciar(cuerpoDetalle);
  tituloDetalle.textContent = detalle.title;

  const fila = crear("div", "row g-4");

  // Columna izquierda: portada, datos generales y enlace para jugar
  const izquierda = crear("div", "col-lg-5");
  const portada = crear("img", "img-fluid rounded w-100 mb-3 juego-miniatura");
  portada.setAttribute("src", detalle.thumbnail);
  portada.setAttribute("alt", `Portada de ${detalle.title}`);
  izquierda.appendChild(portada);

  const datos = crear("dl", "row small mb-3");
  [
    ["Género", detalle.genre],
    ["Plataforma", detalle.platform],
    ["Desarrollador", detalle.developer],
    ["Distribuidor", detalle.publisher],
    ["Lanzamiento", formatearFecha(detalle.release_date)],
    ["Estado", detalle.status],
  ].forEach(function (par) {
    datos.appendChild(crear("dt", "col-5", par[0]));
    datos.appendChild(crear("dd", "col-7", par[1] || "—"));
  });
  izquierda.appendChild(datos);

  if (/^https?:\/\//i.test(detalle.game_url || "")) {
    const enlace = crear("a", "btn btn-success w-100", "Jugar gratis");
    enlace.setAttribute("href", detalle.game_url);
    enlace.setAttribute("target", "_blank");
    enlace.setAttribute("rel", "noopener noreferrer");
    izquierda.appendChild(enlace);
  }

  // Columna derecha: descripcion, requisitos y capturas
  const derecha = crear("div", "col-lg-7");
  derecha.appendChild(crear("h3", "h5", "Acerca del juego"));
  derecha.appendChild(
    crear("p", "juego-descripcion", detalle.description || detalle.short_description || "")
  );

  const requisitos = detalle.minimum_system_requirements;
  if (requisitos) {
    const lista = crear("ul", "list-unstyled small");
    [
      ["Sistema operativo", requisitos.os],
      ["Procesador", requisitos.processor],
      ["Memoria", requisitos.memory],
      ["Gráficos", requisitos.graphics],
      ["Almacenamiento", requisitos.storage],
    ].forEach(function (par) {
      if (par[1]) {
        const item = crear("li", "mb-1");
        item.appendChild(crear("strong", "", `${par[0]}: `));
        item.appendChild(document.createTextNode(par[1]));
        lista.appendChild(item);
      }
    });
    if (lista.children.length > 0) {
      derecha.appendChild(crear("h3", "h5 mt-4", "Requisitos mínimos"));
      derecha.appendChild(lista);
    }
  }

  if (Array.isArray(detalle.screenshots) && detalle.screenshots.length > 0) {
    derecha.appendChild(crear("h3", "h5 mt-4", "Capturas de pantalla"));
    const capturas = crear("div", "row row-cols-2 g-2");
    detalle.screenshots.slice(0, 4).forEach(function (captura, indice) {
      const columna = crear("div", "col");
      const imagen = crear("img", "img-fluid rounded w-100 juego-captura");
      imagen.setAttribute("src", captura.image);
      imagen.setAttribute("alt", `Captura ${indice + 1} de ${detalle.title}`);
      imagen.setAttribute("loading", "lazy");
      columna.appendChild(imagen);
      capturas.appendChild(columna);
    });
    derecha.appendChild(capturas);
  }

  fila.appendChild(izquierda);
  fila.appendChild(derecha);
  cuerpoDetalle.appendChild(fila);
};

const verDetalle = async function (id, titulo) {
  detalleActual = id;
  tituloDetalle.textContent = titulo;
  vaciar(cuerpoDetalle);
  cuerpoDetalle.appendChild(crearCargando("Cargando detalle del juego..."));
  modalDetalle.show();

  try {
    let detalle = detallesEnCache.get(id);
    if (!detalle) {
      detalle = await consultarApi("/game", { id: id });
      if (!detalle || !detalle.title) {
        throw new ErrorApi("No se encontró información para este juego.", "http", 404);
      }
      detallesEnCache.set(id, detalle);
    }
    if (detalleActual !== id) {
      return; // el usuario ya abrio otro juego
    }
    mostrarDetalle(detalle);
  } catch (error) {
    if (detalleActual !== id) {
      return;
    }
    vaciar(cuerpoDetalle);
    cuerpoDetalle.appendChild(crearAlerta("danger", error.message));
  }
};

// ---------------------------------------------------------------------
// Configuracion de la API key
// ---------------------------------------------------------------------
const abrirModalKey = function () {
  inputKey.classList.remove("is-invalid");
  inputKey.value = leerApiKey();
  modalKey.show();
};

btnGuardarKey.addEventListener("click", function () {
  const clave = inputKey.value.trim();
  if (clave === "") {
    inputKey.classList.add("is-invalid");
    inputKey.focus();
    return;
  }
  guardarApiKey(clave);
  modalKey.hide();
  cargarJuegos();
});

btnQuitarKey.addEventListener("click", function () {
  borrarApiKey();
  inputKey.value = "";
  modalKey.hide();
  peticionActual++; // descarta cualquier respuesta pendiente
  juegos = [];
  vaciar(listado);
  btnMas.classList.add("d-none");
  inputTitulo.disabled = true;
  btnBuscar.disabled = false;
  mostrarError(new ErrorApi("Para ver los juegos necesita configurar su API key de RapidAPI.", "sin-key"));
});

// ---------------------------------------------------------------------
// Eventos y arranque
// ---------------------------------------------------------------------
formFiltros.addEventListener("submit", function (evento) {
  evento.preventDefault();
  cargarJuegos();
});
inputTitulo.addEventListener("input", aplicarBusqueda);
btnMas.addEventListener("click", mostrarMas);
btnApiKey.addEventListener("click", abrirModalKey);

// Al abrir la pagina: si ya hay clave carga el listado; si no, explica que falta
if (leerApiKey()) {
  cargarJuegos();
} else {
  mostrarError(new ErrorApi("Para ver los juegos necesita configurar su API key de RapidAPI.", "sin-key"));
}
