import { Maker } from "./maker.js";
import { Grafico } from "./grafico.js";

var idioma = $("#lenguaje").val();

fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

const maker = new Maker();

const grafico = new Grafico(
  new fabric.Canvas("c", {
    selection: false,
  })
);

grafico.pintar();

var intervalo;
$("#play").on("click", function () {
  let letras = [];
  if ($("#palabra").val() == "") {
    if (idioma == "es") {
      swal("Error", "Por favor escribe una palabra", "error");
    } else {
      swal("Error", "Please write a word", "error");
    }
  } else {
    for (let letra of $("#palabra").val()) {
      letras.push(letra);
      maker.makeSquare(letra, "idejemplo").appendTo($("#cinta"));
    }
    let resultado = validarPalabra(letras);
    animar(resultado.animaciones, resultado.resultado);
  }
});

$("#stop").on("click", function () {
  if (intervalo != null) {
    clearInterval(intervalo);
    $("#cinta").empty();
  }
});

var intervalo;
var velocidad = 2000;
var inter = 1;
var indice = 0;

var animar = (listaAnimaciones, resultado) => {
  let index = 0;
  intervalo = setInterval(() => {
    grafico.setearGrafo();
    if (index < listaAnimaciones.length) {
      grafico.setCirculo(
        listaAnimaciones[index].circulo,
        listaAnimaciones[index].anim
      );
      grafico.rePintar();
    }
    index++;
    indice++;
    if (indice == listaAnimaciones.length + 1) {
      if (idioma == "es") {
        if (resultado == false) {
          swal("Oh no", "Palabra Incorrecta", "error");
        } else {
          swal("Enhorabuena", "Palabra Correcta", "success");
        }
      } else {
        if (resultado == false) {
          swal("Oh no", "Incorrect word", "error");
        } else {
          swal("Congratulations", "Right word", "success");
        }
      }
    }
  }, velocidad / inter);
};

var validarPalabra = (letras) => {
  var palabraCorrecta = true;
  var estado = "Q0";
  var primerCaminoVisitado = false;
  var listaAnimaciones = [];
  for (let index = 0; index < letras.length; index++) {
    if (palabraCorrecta) {
      let newState = getNextState(estado, letras[index]);
      if (newState == null) {
        if (
          estado == "Q0" ||
          estado == "Q2" ||
          estado == "Q3" ||
          estado == "Q4"
        ) {
          if (estado == "Q0") {
            palabraCorrecta = false;
          } else if (!primerCaminoVisitado) {
            primerCaminoVisitado = true;
            index = 1;
            estado = "Q3";
          } else if (primerCaminoVisitado) {
            palabraCorrecta = false;
          }
          listaAnimaciones.push({ circulo: estado, anim: { fill: "#A00" } });
        }
      } else {
        estado = newState;
        listaAnimaciones.push({ circulo: estado, anim: { fill: "#0A0" } });
        if (index == letras.length - 1) {
          if (estado != "Q3" && estado != "Q1") {
            palabraCorrecta = false;
          }
        }
      }
    }
  }
  return { resultado: palabraCorrecta, animaciones: listaAnimaciones };
};

var getNextState = (estado, letra) => {
  var newState = "";
  switch (estado) {
    case "Q0":
      if (letra == "b") {
        newState = "Q1";
      } else {
        newState = null;
      }
      break;
    case "Q1":
      if (letra == "b") {
        newState = "Q1";
      } else {
        newState = "Q2";
      }
      break;
    case "Q2":
      if (letra == "a") {
        newState = "Q1";
      } else {
        newState = null;
      }
      break;
    case "Q3":
      if (letra == "b") {
        newState = "Q4";
      } else {
        newState = null;
      }
      break;
    case "Q4":
      if (letra == "a") {
        newState = "Q3";
      } else {
        newState = null;
      }
      break;
    default:
      newState = null;
      break;
  }
  return newState;
};

$("#subirVelocidad").on("click", function () {
  inter = 5;
});

$("#stop").on("click", function () {
  inter = 1;
  clearInterval(intervalo);
  grafico.setearGrafo();
  grafico.rePintar();
  $("#palabra").val("");
  indice = 0;
});
