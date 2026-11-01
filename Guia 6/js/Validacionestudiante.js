const expresiones = {
  carnet: /^[A-Za-z]{2}\d{3}$/,
  nombre: /^\p{L}+(?:\s\p{L}+)+$/u,
  dui: /^\d{8}-\d$/,
  nit: /^\d{4}-\d{6}-\d{3}-\d$/,
  fecha: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
  correo: /^[\w.%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
  edad: /^\d{1,3}$/,
};
 
// La regex de la fecha solo revisa el formato; esta función comprueba
// que la fecha exista (por ejemplo, que no sea 31/02) y que no sea futura.
const esFechaReal = (texto) => {
  const [dia, mes, anio] = texto.split("/").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
 
  return (
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia &&
    fecha <= new Date()
  );
};
 
// Lista de campos a validar: id del input, regex y, si hace falta, una
// comprobación adicional.
const campos = [
  { id: "idCarnet", regex: expresiones.carnet },
  { id: "idNombreCompleto", regex: expresiones.nombre },
  { id: "idDui", regex: expresiones.dui },
  { id: "idNit", regex: expresiones.nit },
  { id: "idFechaNacimiento", regex: expresiones.fecha, extra: esFechaReal },
  { id: "idCorreo", regex: expresiones.correo },
  { id: "idEdad", regex: expresiones.edad },
];
 
const contenedorResultado = document.getElementById("idResultado");
const botonValidar = document.getElementById("idBtnValidar");
const botonLimpiar = document.getElementById("idBtnLimpiarFicha");
 
// Valida un campo y marca el input como válido o inválido con las clases de Bootstrap
const validarCampo = (campo) => {
  const input = document.getElementById(campo.id);
  const valor = input.value.trim();
 
  let valido = campo.regex.test(valor);
  if (valido && campo.extra) {
    valido = campo.extra(valor);
  }
 
  input.classList.toggle("is-valid", valido);
  input.classList.toggle("is-invalid", !valido);
 
  return valido;
};
 
// Validación de toda la ficha (botón "Validar ficha")
const validarFormulario = () => {
  const resultados = campos.map(validarCampo);
  const invalidos = resultados.filter((r) => !r).length;
 
  if (invalidos == 0) {
    contenedorResultado.innerHTML =
      '<div class="alert alert-success" role="alert">La ficha es válida: todos los campos cumplen el formato.</div>';
  } else {
    contenedorResultado.innerHTML = `<div class="alert alert-danger" role="alert">Hay ${invalidos} campo(s) con errores. Corrija los campos marcados en rojo.</div>`;
  }
};
 
// Quita las marcas de validación y el mensaje de resultado
const limpiarFormulario = () => {
  document.getElementById("idFormEstudiante").reset();
 
  campos.forEach((campo) => {
    document
      .getElementById(campo.id)
      .classList.remove("is-valid", "is-invalid");
  });
 
  contenedorResultado.innerHTML = "";
  document.getElementById("idCarnet").focus();
};
 
// Validación en tiempo real: cada vez que el usuario escribe en un campo
campos.forEach((campo) => {
  const input = document.getElementById(campo.id);
 
  input.addEventListener("input", () => {
    if (input.value.trim() == "") {
      // Campo vacío: se quitan las marcas hasta que se presione "Validar ficha"
      input.classList.remove("is-valid", "is-invalid");
    } else {
      validarCampo(campo);
    }
  });
});
 
botonValidar.addEventListener("click", validarFormulario);
botonLimpiar.addEventListener("click", limpiarFormulario);