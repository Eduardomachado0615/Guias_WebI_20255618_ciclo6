
// Referencias a los botones
const buttonAgregarPagina =
    document.querySelector("#idAgregarPagina");

const buttonMenu =
    document.querySelector("#idAgregarMenu");

const buttonTitulo =
    document.querySelector("#idAgregarTitulo");

const buttonParrafo =
    document.querySelector("#idAgregarParrafo");

const pagina = document.querySelector("#idPagina");

// Agregar contenedor
buttonAgregarPagina.onclick = function () {

    const contenedorVerificado =
        document.querySelector("#idDivPage");

    if (!contenedorVerificado) {

        const contenedor = document.createElement("div");

        contenedor.setAttribute("id", "idDivPage");

        contenedor.setAttribute("class", "container");

        contenedor.setAttribute(
            "style",
            "border: solid 1px black; min-height: 500px; overflow: auto;"
        );

        pagina.appendChild(contenedor);

    } else {
        alert("Ya se agregó el contenedor de la página");
    }
};

// Agregar menú
buttonMenu.onclick = function () {

    const contenedor =
        document.querySelector("#idDivPage");

    if (contenedor) {

        const menuVerificar =
            contenedor.querySelectorAll("header");

        if (menuVerificar.length === 0) {

            const menu = document.querySelector("header");

            const nuevoMenu = menu.cloneNode(true);

            contenedor.appendChild(nuevoMenu);

        } else {
            alert("Ya ha sido agregado el menú");
        }

    } else {
        alert("Primero debe agregar un contenedor de página");
    }
};

// Agregar título
buttonTitulo.onclick = function () {

    const contenedor =
        document.querySelector("#idDivPage");

    if (contenedor) {

        const menu =
            contenedor.querySelectorAll("header");

        if (menu.length > 0) {

            let titulo = prompt(
                "Agregue el título de la página"
            );

            if (titulo !== null && titulo.trim() !== "") {

                const h3 = document.createElement("h3");

                h3.setAttribute(
                    "class",
                    "display-5 text-center fw-bold py-4 my-4"
                );

                h3.textContent = titulo;

                contenedor.appendChild(h3);

            } else {
                alert("No se ha registrado ningún título");
            }

        } else {
            alert("Debe agregar un menú primero");
        }

    } else {
        alert("Primero debe agregar un contenedor de página");
    }
};

// Agregar párrafo
buttonParrafo.onclick = function () {

    const contenedor =
        document.querySelector("#idDivPage");

    if (contenedor) {

        const menu =
            contenedor.querySelectorAll("header");

        if (menu.length > 0) {

            let texto = prompt(
                "Agregue un párrafo a su página web"
            );

            if (texto !== null && texto.trim() !== "") {

                const parrafo = document.createElement("p");

                parrafo.setAttribute(
                    "class",
                    "lead mb-4 py-4"
                );

                parrafo.textContent = texto;

                contenedor.appendChild(parrafo);

            } else {
                alert("No se ha registrado ningún párrafo");
            }

        } else {
            alert("Debe agregar un menú primero");
        }

    } else {
        alert("Primero debe agregar un contenedor de página");
    }
};
