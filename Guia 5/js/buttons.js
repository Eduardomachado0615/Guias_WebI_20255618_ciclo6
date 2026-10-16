function aviso(){
    alert("bienvenido al mundo JavaScript");
}

function confirmacion(){
    let confirmacion = confirm("¿Desea salir de la Sesion?");

    alert(`valor seleccionado${confirmacion}`);
}

function capturarDatos(){
    let nombre = proompt("¿Cual es su nombre");
    let edad = prompt("¿Cual es su edad?", 0);

    alert(`su nombre es ${nombre} y su edad ${edad}`);
}

function dibujarParrafo(){
    let parrafo = prompt(
        "Ecriba la informacion que desea visualizar en el parrafo"
    );

    const p = document.querySelector("#idParrafo");
    p.innerHTML = parrafo;
}