
// Cambiar color del fondo
const primerColorFondo = function (event) {
    document.body.style.backgroundColor = event.target.value;
};

const cambiarColorFondo = function (color) {
    document.body.style.backgroundColor = color;
};

// Cambiar color de títulos
const primerColorTitulos = function (event) {
    let colorSeleccionado = event.target.value;

    const titulos = document.querySelectorAll("h1,h2,h3");

    for (let index = 0; index < titulos.length; index++) {
        titulos[index].style.color = colorSeleccionado;
    }
};

const cambiarColorTitulos = function (colorSeleccionado) {

    const titulos = document.querySelectorAll("h1,h2,h3");

    for (let index = 0; index < titulos.length; index++) {
        titulos[index].style.color = colorSeleccionado;
    }
};

// Cambiar color de párrafos
const primerColorParrafos = function (event) {

    let colorSeleccionado = event.target.value;

    const parrafos = document.querySelectorAll("p");

    for (let index = 0; index < parrafos.length; index++) {
        parrafos[index].style.color = colorSeleccionado;
    }
};

const cambiarColorParrafos = function (colorSeleccionado) {

    const parrafos = document.querySelectorAll("p");

    for (let index = 0; index < parrafos.length; index++) {
        parrafos[index].style.color = colorSeleccionado;
    }
};

// Aumentar tamaño de letras
let contadorAumentar = 1;

const aumentarLetra = function () {

    contadorAumentar += 0.05;

    document.body.style.fontSize =
        `${contadorAumentar}em`;

    const parrafos = document.querySelectorAll("p");

    for (let index = 0; index < parrafos.length; index++) {
        parrafos[index].style.fontSize =
            `${contadorAumentar}em`;
    }

    const titulos = document.querySelectorAll("h1,h2,h3");

    for (let index = 0; index < titulos.length; index++) {
        titulos[index].style.fontSize =
            `${contadorAumentar}em`;
    }
};

// Disminuir tamaño de letras
let contadorDisminuir = 1;

const disminuirLetra = function () {

    contadorDisminuir -= 0.05;

    if (contadorDisminuir < 0.5) {
        contadorDisminuir = 0.5;
    }

    document.body.style.fontSize =
        `${contadorDisminuir}em`;

    const parrafos = document.querySelectorAll("p");

    for (let index = 0; index < parrafos.length; index++) {
        parrafos[index].style.fontSize =
            `${contadorDisminuir}em`;
    }

    const titulos = document.querySelectorAll("h1,h2,h3");

    for (let index = 0; index < titulos.length; index++) {
        titulos[index].style.fontSize =
            `${contadorDisminuir}em`;
    }
};

// Inicializar eventos
const startDOM = () => {

    const buttonFondo = document.getElementById("idFondo");

    buttonFondo.addEventListener(
        "input",
        primerColorFondo,
        false
    );

    buttonFondo.addEventListener(
        "change",
        primerColorFondo,
        false
    );

    const buttonTitulos = document.getElementById("idTitulos");

    buttonTitulos.addEventListener(
        "input",
        primerColorTitulos,
        false
    );

    buttonTitulos.addEventListener(
        "change",
        primerColorTitulos,
        false
    );

    const buttonParrafos = document.getElementById("idParrafos");

    buttonParrafos.addEventListener(
        "input",
        primerColorParrafos,
        false
    );

    buttonParrafos.addEventListener(
        "change",
        primerColorParrafos,
        false
    );

    const buttonAumentar =
        document.getElementById("idBtnAumentar");

    const buttonDisminuir =
        document.getElementById("idBtnDisminuir");

    buttonAumentar.addEventListener(
        "click",
        aumentarLetra,
        false
    );

    buttonDisminuir.addEventListener(
        "click",
        disminuirLetra,
        false
    );
};

// Ejecutar inicialización
startDOM();
