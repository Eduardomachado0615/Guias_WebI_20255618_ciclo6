
const buttonSpan = document.getElementById("idBtnSpan");
const buttonP = document.getElementById("idBtnP");
const buttonDiv = document.getElementById("idBtnDiv");
const buttonButton = document.getElementById("idBtnButton");
const imprimir = document.getElementById("idImprimirResultado");

// Función para contar elementos HTML
const contarElementos = function (elemento) {
    const arrayElement = document.getElementsByTagName(elemento);

    console.log(
        `Etiquetas buscadas <${elemento}> / Total encontradas: ${arrayElement.length}`
    );

    for (const item of arrayElement) {
        console.log(item);
    }

    if (imprimir) {
        imprimir.textContent =
            `${elemento}: ${arrayElement.length} elementos`;
    }

    alert("Revise la consola del navegador");
};

// Eventos de los botones
buttonSpan.onclick = () => {
    contarElementos("span");
};

buttonP.onclick = () => {
    contarElementos("p");
};

buttonDiv.onclick = () => {
    contarElementos("div");
};

buttonButton.onclick = () => {
    contarElementos("button");
};
