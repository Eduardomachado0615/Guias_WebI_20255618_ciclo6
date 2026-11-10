
// Referencias
const formulario = document.forms["frmRegistro"];

const button =
    document.forms["frmRegistro"].elements["btnRegistro"];

const modal = new bootstrap.Modal(
    document.getElementById("idModal"),
    {}
);

const bodyModal = document.getElementById("idBodyModal");

// Recorrer formulario
const recorrerFormulario = function () {

    let totText = 0;
    let totRadio = 0;
    let totCheck = 0;
    let totDate = 0;
    let totSelect = 0;
    let totFile = 0;
    let totPass = 0;
    let totEmail = 0;

    let elementos = formulario.elements;
    let totalElementos = elementos.length;

    for (let index = 0; index < totalElementos; index++) {

        let elemento = elementos[index];
        let tipoElemento = elemento.type;
        let tipoNode = elemento.nodeName;

        if (tipoElemento === "text" && tipoNode === "INPUT") {
            console.log(elemento);
            totText++;
        }

        else if (
            tipoElemento === "password" &&
            tipoNode === "INPUT"
        ) {
            console.log(elemento);
            totPass++;
        }

        else if (
            tipoElemento === "email" &&
            tipoNode === "INPUT"
        ) {
            console.log(elemento);
            totEmail++;
        }

        else if (
            tipoElemento === "radio" &&
            tipoNode === "INPUT"
        ) {
            console.log(elemento);
            totRadio++;
        }

        else if (
            tipoElemento === "checkbox" &&
            tipoNode === "INPUT"
        ) {
            console.log(elemento);
            totCheck++;
        }

        else if (
            tipoElemento === "file" &&
            tipoNode === "INPUT"
        ) {
            console.log(elemento);
            totFile++;
        }

        else if (
            tipoElemento === "date" &&
            tipoNode === "INPUT"
        ) {
            console.log(elemento);
            totDate++;
        }

        else if (tipoNode === "SELECT") {
            console.log(elemento);
            totSelect++;
        }
    }

    // Mostrar los resultados
    const resultado = [
        `Total de input[type="text"] = ${totText}`,
        `Total de input[type="password"] = ${totPass}`,
        `Total de input[type="radio"] = ${totRadio}`,
        `Total de input[type="checkbox"] = ${totCheck}`,
        `Total de input[type="date"] = ${totDate}`,
        `Total de input[type="email"] = ${totEmail}`,
        `Total de input[type="file"] = ${totFile}`,
        `Total de select = ${totSelect}`
    ];

    bodyModal.replaceChildren();

    resultado.forEach(texto => {
        const p = document.createElement("p");
        p.textContent = texto;
        bodyModal.appendChild(p);
    });

    modal.show();
};

// Evento del botón
button.onclick = () => {
    recorrerFormulario();
};
