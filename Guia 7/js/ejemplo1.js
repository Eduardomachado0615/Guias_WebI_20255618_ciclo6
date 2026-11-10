
// Referencias del formulario
const newForm = document.getElementById("idNewForm");

// Referencias de los botones
const buttonCrear = document.getElementById("idBtnCrear");
const buttonAddElemento = document.getElementById("idBtnAddElement");

// Selector del tipo de elemento
const cmbElemento = document.getElementById("idCmbElemento");

// Controles del modal
const tituloElemento = document.getElementById("idTituloElemento");
const nombreElemento = document.getElementById("idNombreElemento");

// Modal Bootstrap
const modal = new bootstrap.Modal(
    document.getElementById("idModal"),
    {}
);

// Verificar el tipo de elemento seleccionado
const verificarTipoElemento = function () {
    let elemento = cmbElemento.value;

    if (elemento !== "") {
        modal.show();
    } else {
        alert("Debe seleccionar el elemento que se creará");
    }
};

// Crear SELECT
const newSelect = function () {

    const addElemento = document.createElement("select");

    addElemento.setAttribute("id", nombreElemento.value);
    addElemento.setAttribute("class", "form-select");

    // Agregar diez opciones
    for (let i = 1; i <= 10; i++) {
        let addOption = document.createElement("option");
        addOption.value = i;
        addOption.textContent = `Opción ${i}`;

        addElemento.appendChild(addOption);
    }

    // Crear etiqueta
    let labelElemento = document.createElement("label");

    labelElemento.setAttribute("for", nombreElemento.value);
    labelElemento.textContent = tituloElemento.value;

    // Mostrar ID
    let labelId = document.createElement("span");
    labelId.textContent =
        ` ID de control: ${nombreElemento.value}`;

    // Crear contenedor
    let divElemento = document.createElement("div");

    divElemento.setAttribute(
        "class",
        "form-floating mb-3"
    );

    divElemento.appendChild(addElemento);
    divElemento.appendChild(labelElemento);
    divElemento.appendChild(labelId);

    newForm.appendChild(divElemento);
};

// Crear RADIO o CHECKBOX
const newRadioCheckBox = function (newElemento) {

    let addElemento = document.createElement("input");

    addElemento.setAttribute("id", nombreElemento.value);
    addElemento.setAttribute("type", newElemento);
    addElemento.setAttribute("class", "form-check-input");

    // Crear label
    let labelElemento = document.createElement("label");

    labelElemento.setAttribute("class", "form-check-label");
    labelElemento.setAttribute("for", nombreElemento.value);
    labelElemento.textContent = tituloElemento.value;

    // Mostrar ID
    let labelId = document.createElement("span");

    labelId.textContent =
        ` ID de control: ${nombreElemento.value}`;

    // Contenedor Bootstrap
    let divElemento = document.createElement("div");

    divElemento.setAttribute("class", "form-check mb-3");

    divElemento.appendChild(addElemento);
    divElemento.appendChild(labelElemento);
    divElemento.appendChild(labelId);

    newForm.appendChild(divElemento);
};

// Crear INPUT o TEXTAREA
const newInput = function (newElemento) {

    let addElemento;

    if (newElemento === "textarea") {
        addElemento = document.createElement("textarea");
    } else {
        addElemento = document.createElement("input");
        addElemento.setAttribute("type", newElemento);
    }

    addElemento.setAttribute("id", nombreElemento.value);
    addElemento.setAttribute("class", "form-control");

    addElemento.setAttribute(
        "placeholder",
        tituloElemento.value
    );

    // Crear label
    let labelElemento = document.createElement("label");

    labelElemento.setAttribute("for", nombreElemento.value);
    labelElemento.textContent = tituloElemento.value;

    // Mostrar ID
    let labelId = document.createElement("span");

    labelId.textContent =
        ` ID de control: ${nombreElemento.value}`;

    // Contenedor
    let divElemento = document.createElement("div");

    divElemento.setAttribute(
        "class",
        "form-floating mb-3"
    );

    divElemento.appendChild(addElemento);
    divElemento.appendChild(labelElemento);
    divElemento.appendChild(labelId);

    newForm.appendChild(divElemento);
};

// Evento del botón Crear
buttonCrear.onclick = () => {
    verificarTipoElemento();
};

// Evento del botón Agregar elemento
buttonAddElemento.onclick = () => {

    if (
        nombreElemento.value.trim() !== "" &&
        tituloElemento.value.trim() !== ""
    ) {

        if (document.getElementById(nombreElemento.value)) {
            alert("Ese ID ya existe");
            return;
        }

        let elemento = cmbElemento.value;

        if (elemento === "select") {
            newSelect();
        } else if (
            elemento === "radio" ||
            elemento === "checkbox"
        ) {
            newRadioCheckBox(elemento);
        } else {
            newInput(elemento);
        }

        modal.hide();

    } else {
        alert("Faltan campos por completar");
    }
};

// Enfocar el campo al abrir el modal
document.getElementById("idModal").addEventListener(
    "shown.bs.modal",
    () => {
        tituloElemento.focus();
    }
);
