/* =====================================================================
   EJEMPLO 3 (parte III de la guia): Recorriendo un formulario con DOM
   EJERCICIO 1 (parte IV de la guia): Validacion del formulario
   ===================================================================== */

// Obteniendo la referencia de los elementos
// por medio de arreglos asociativos
// aqui se esta utilizando el atributo name de cada elemento
const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];
const buttonContar = document.forms["frmRegistro"].elements["btnContar"];

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// OBTENIENDO LA REFERENCIA DEL CUERPO DEL MODAL
// PARA IMPRIMIR EL RESULTADO
const bodyModal = document.getElementById("idBodyModal");
const tituloModal = document.getElementById("modalLabel");

// Elimina todos los hijos de un nodo usando removeChild()
const limpiarNodo = function (nodo) {
  while (nodo.firstChild) {
    nodo.removeChild(nodo.firstChild);
  }
};

/* ---------------------------------------------------------------------
   EJEMPLO 3: recorrer el formulario y contar sus controles
   --------------------------------------------------------------------- */
const recorrerFormulario = function () {
  let totText = 0;
  let totRadio = 0;
  let totCheck = 0;
  let totDate = 0;
  let totSelect = 0;
  let totFile = 0;
  let totPass = 0;
  let totEmail = 0;

  // Recorriendo elementos del formulario
  let elementos = formulario.elements;
  let totalElementos = elementos.length;

  for (let index = 0; index < totalElementos; index++) {
    // Accediendo a cada hijo del formulario
    let elemento = elementos[index];

    // verificando el tipo de control en el formulario
    let tipoElemento = elemento.type;
    // verificando el tipo de nodo
    let tipoNode = elemento.nodeName;

    // Contabilizando el total de INPUT TYPE = TEXT
    if (tipoElemento == "text" && tipoNode == "INPUT") {
      console.log(elemento);
      totText++;
    }
    // Contabilizando el total de INPUT TYPE = PASSWORD
    else if (tipoElemento == "password" && tipoNode == "INPUT") {
      console.log(elemento);
      totPass++;
    }
    // Contabilizando el total de INPUT TYPE = EMAIL
    else if (tipoElemento == "email" && tipoNode == "INPUT") {
      console.log(elemento);
      totEmail++;
    }
    // Contabilizando el total de INPUT TYPE = RADIO
    else if (tipoElemento == "radio" && tipoNode == "INPUT") {
      console.log(elemento);
      totRadio++;
    }
    // Contabilizando el total de INPUT TYPE = CHECKBOX
    else if (tipoElemento == "checkbox" && tipoNode == "INPUT") {
      console.log(elemento);
      totCheck++;
    }
    // Contabilizando el total de INPUT TYPE = FILE
    else if (tipoElemento == "file" && tipoNode == "INPUT") {
      console.log(elemento);
      totFile++;
    }
    // Contabilizando el total de INPUT TYPE = DATE
    else if (tipoElemento == "date" && tipoNode == "INPUT") {
      console.log(elemento);
      totDate++;
    }
    // Contabilizando el total de SELECT
    else if (tipoNode == "SELECT") {
      console.log(elemento);
      totSelect++;
    }
  }

  let resultado = [
    ['input[type="text"]', totText],
    ['input[type="password"]', totPass],
    ['input[type="radio"]', totRadio],
    ['input[type="checkbox"]', totCheck],
    ['input[type="date"]', totDate],
    ['input[type="email"]', totEmail],
    ["select", totSelect],
  ];

  // El resultado se arma solo con funciones del DOM (createTextNode, createElement)
  limpiarNodo(bodyModal);
  resultado.forEach(function (fila) {
    bodyModal.appendChild(
      document.createTextNode(`Total de ${fila[0]} = ${fila[1]}`)
    );
    bodyModal.appendChild(document.createElement("br"));
  });

  tituloModal.textContent = "Elementos del formulario";
  //Funcion que permite mostrar el modal de Bootstrap
  //Esta funcion es definida por Bootstrap
  modal.show();
};

/* ---------------------------------------------------------------------
   EJERCICIO 1: validacion del formulario
   --------------------------------------------------------------------- */

// Cambie a true si tambien quiere exigir la imagen del avatar
const AVATAR_OBLIGATORIO = false;

// Expresion regular para el correo electronico
const REGEX_CORREO =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// Referencias a los controles
const txtNombres = document.getElementById("idNombre");
const txtApellidos = document.getElementById("idApellidos");
const txtFechaNac = document.getElementById("idFechaNac");
const txtCorreo = document.getElementById("idCorreo");
const txtPassword = document.getElementById("idPassword");
const txtPasswordRepetir = document.getElementById("idPasswordRepetir");
const cmbPais = document.getElementById("idCmPais");
const fileAvatar = document.getElementById("idArchivo");
const checksIntereses = formulario.querySelectorAll('input[type="checkbox"]');
const radiosCarrera = formulario.querySelectorAll('input[name="idRdCarrera"]');

// Crea un aviso de error debajo del control (o al final del contenedor)
const mostrarError = function (control, mensaje, contenedor) {
  control.classList.add("is-invalid");

  const aviso = document.createElement("div");
  aviso.setAttribute("class", "invalid-feedback d-block js-error" + (contenedor ? " mb-3" : ""));
  aviso.appendChild(document.createTextNode(mensaje));

  if (contenedor) {
    contenedor.appendChild(aviso);
  } else {
    control.insertAdjacentElement("afterend", aviso);
  }
};

// Quita los avisos y los estilos de error de la validacion anterior
const limpiarErrores = function () {
  const avisos = formulario.querySelectorAll(".js-error");
  avisos.forEach(function (aviso) {
    aviso.parentNode.removeChild(aviso);
  });

  const invalidos = formulario.querySelectorAll(".is-invalid");
  invalidos.forEach(function (control) {
    control.classList.remove("is-invalid");
  });
};

// Texto del <label> asociado a un control (por su atributo for)
const textoDeLabel = function (control) {
  const label = document.querySelector(`label[for="${control.id}"]`);
  return label ? label.textContent.trim() : control.id;
};

// Revisa todas las validaciones y devuelve la lista de errores (vacia si todo esta bien)
const validarFormulario = function () {
  const errores = [];

  // a. Campos no vacios
  const obligatorios = [
    [txtNombres, "Ingrese sus nombres"],
    [txtApellidos, "Ingrese sus apellidos"],
    [txtFechaNac, "Seleccione su fecha de nacimiento"],
    [txtCorreo, "Ingrese su correo electronico"],
    [txtPassword, "Ingrese una contraseña"],
    [txtPasswordRepetir, "Repita la contraseña"],
  ];
  obligatorios.forEach(function (campo) {
    if (campo[0].value.trim() === "") {
      errores.push({ control: campo[0], mensaje: campo[1] });
    }
  });

  // b. La fecha de nacimiento no puede superar la fecha actual
  if (txtFechaNac.value !== "") {
    const partes = txtFechaNac.value.split("-").map(Number);
    const nacimiento = new Date(partes[0], partes[1] - 1, partes[2]);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (nacimiento > hoy) {
      errores.push({
        control: txtFechaNac,
        mensaje: "La fecha de nacimiento no puede ser mayor a la fecha actual",
      });
    }
  }

  // c. Correo valido (expresion regular)
  if (txtCorreo.value.trim() !== "" && !REGEX_CORREO.test(txtCorreo.value.trim())) {
    errores.push({
      control: txtCorreo,
      mensaje: "Ingrese un correo valido, por ejemplo: nombre@dominio.com",
    });
  }

  // d. Contraseña y repetir contraseña iguales
  if (
    txtPassword.value !== "" &&
    txtPasswordRepetir.value !== "" &&
    txtPassword.value !== txtPasswordRepetir.value
  ) {
    errores.push({
      control: txtPasswordRepetir,
      mensaje: "Las contraseñas no coinciden",
    });
  }

  // e. Al menos un interes seleccionado
  const interesesMarcados = formulario.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  if (interesesMarcados.length === 0) {
    checksIntereses.forEach(function (check) {
      check.classList.add("is-invalid");
    });
    errores.push({
      control: checksIntereses[0],
      mensaje: "Seleccione al menos un interes",
      contenedor: checksIntereses[0].closest(".col"),
    });
  }

  // f. Una carrera seleccionada
  const carreraMarcada = formulario.querySelector(
    'input[name="idRdCarrera"]:checked'
  );
  if (!carreraMarcada) {
    radiosCarrera.forEach(function (radio) {
      radio.classList.add("is-invalid");
    });
    errores.push({
      control: radiosCarrera[0],
      mensaje: "Seleccione la carrera que estudia",
      contenedor: radiosCarrera[0].closest(".col"),
    });
  }

  // g. Un pais de origen seleccionado (la opcion 0 es "Seleccione una opcion")
  if (cmbPais.selectedIndex <= 0) {
    errores.push({ control: cmbPais, mensaje: "Seleccione su país de origen" });
  }

  // Avatar (opcional, salvo que AVATAR_OBLIGATORIO sea true)
  if (AVATAR_OBLIGATORIO && fileAvatar.files.length === 0) {
    errores.push({ control: fileAvatar, mensaje: "Seleccione la imagen de su avatar" });
  }

  return errores;
};

// Crea una celda <th> o <td> con texto, usando solo funciones del DOM
const crearCelda = function (etiqueta, texto, scope) {
  const celda = document.createElement(etiqueta);
  if (scope) {
    celda.setAttribute("scope", scope);
  }
  celda.appendChild(document.createTextNode(texto));
  return celda;
};

// Crea la tabla con la informacion capturada: filas = [[campo, valor], ...]
const crearTabla = function (filas) {
  const tabla = document.createElement("table");
  tabla.setAttribute("class", "table table-striped table-bordered align-middle");

  const thead = document.createElement("thead");
  const trCabecera = document.createElement("tr");
  trCabecera.appendChild(crearCelda("th", "Campo", "col"));
  trCabecera.appendChild(crearCelda("th", "Valor", "col"));
  thead.appendChild(trCabecera);
  tabla.appendChild(thead);

  const tbody = document.createElement("tbody");
  filas.forEach(function (fila) {
    const tr = document.createElement("tr");
    tr.appendChild(crearCelda("th", fila[0], "row"));
    tr.appendChild(crearCelda("td", fila[1]));
    tbody.appendChild(tr);
  });
  tabla.appendChild(tbody);

  return tabla;
};

// Muestra en el modal los datos validados
const mostrarRegistro = function () {
  const partesFecha = txtFechaNac.value.split("-");
  const fechaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

  const intereses = [];
  formulario
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach(function (check) {
      intereses.push(textoDeLabel(check));
    });

  const carrera = textoDeLabel(
    formulario.querySelector('input[name="idRdCarrera"]:checked')
  );
  const pais = cmbPais.options[cmbPais.selectedIndex].text;
  const archivo = fileAvatar.files.length > 0 ? fileAvatar.files[0] : null;

  const filas = [
    ["Nombres", txtNombres.value.trim()],
    ["Apellidos", txtApellidos.value.trim()],
    ["Fecha de nacimiento", fechaFormateada],
    ["Correo electrónico", txtCorreo.value.trim()],
    ["Contraseña", "*".repeat(txtPassword.value.length)],
    ["Intereses", intereses.join(", ")],
    ["Carrera", carrera],
    ["País de origen", pais],
    ["Avatar", archivo ? archivo.name : "No se seleccionó ninguna imagen"],
  ];

  limpiarNodo(bodyModal);
  bodyModal.appendChild(crearTabla(filas));

  // Vista previa del avatar (solo si el archivo es una imagen)
  if (archivo && archivo.type.startsWith("image/")) {
    const imagen = document.createElement("img");
    imagen.setAttribute("src", URL.createObjectURL(archivo));
    imagen.setAttribute("alt", "Avatar seleccionado");
    imagen.setAttribute("class", "img-thumbnail d-block mx-auto");
    imagen.setAttribute("style", "max-width: 140px;");
    bodyModal.appendChild(imagen);
  }

  tituloModal.textContent = "Registro validado";
  modal.show();
};

// Evento del boton "Enviar registro": valida y, si todo esta bien, muestra el modal
button.onclick = () => {
  limpiarErrores();
  const errores = validarFormulario();

  if (errores.length > 0) {
    errores.forEach(function (error) {
      mostrarError(error.control, error.mensaje, error.contenedor);
    });
    // Ordena los errores segun su posicion en la pagina y lleva el cursor al primero
    errores.sort(function (a, b) {
      return a.control.compareDocumentPosition(b.control) &
        Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;
    });
    errores[0].control.focus();
    return;
  }

  mostrarRegistro();
};

// Evento del boton del ejemplo 3: contar los controles del formulario
buttonContar.onclick = () => {
  recorrerFormulario();
};

// El formulario nunca debe enviarse por la URL
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
});
