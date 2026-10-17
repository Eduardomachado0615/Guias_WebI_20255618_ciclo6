// Generamos un numero aleatorio que se encuentre en el rango del 1 al 25
const numeroAleatorio = Math.floor(Math.random() * 25) + 1;
// Creamos una constante que permite identificar el maximo de intentos
const numeroIntentos = 3;
// Guardara el numero de intentos que realiza el usuario
let intentos = 1;

function generarNumeroAleatorio() {
    // Definimos una variable para impresion de mensajes
    let mensaje;
    // Utilizamos el dom para acceder al parrafo creado
    const parrafo = document.querySelector("#idParrafo");

    // Verificamos en que intento esta el usuario
    if (intentos <= numeroIntentos) {
        let numero = prompt(
            "¿Que número se ha generado (Intento " + intentos + ")?"
        );

        // Verificamos si adivinó el número
        if (numero == numeroAleatorio) {
            mensaje = `¡Es sorprendente, pudiste adivinar el numero oculto (${numeroAleatorio}). Refresque la página para volver a jugar.`;
        } else if (intentos == numeroIntentos) {
            mensaje = `Su numero de intentos ha terminado. El numero oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
        } else {
            // Evaluamos si el número buscado es mayor o menor al ingresado
            if (numero < numeroAleatorio) {
                mensaje = `Vuelve a intentar. El número oculto es **más alto**. Quedan ${numeroIntentos - intentos} intentos.`;
            } else {
                mensaje = `Vuelve a intentar. El número oculto es **más bajo**. Quedan ${numeroIntentos - intentos} intentos.`;
            }
        }
        // Aumentamos el valor de los intentos
        intentos++;
    } else {
        mensaje = `Su numero de intentos ha terminado. El numero oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
    }
    
    parrafo.innerHTML = mensaje;
}