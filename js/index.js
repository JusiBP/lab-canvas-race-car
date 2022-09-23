window.onload = () => {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d"); //Todas las funciones dependerán del contexto!!

  const imgFondo = document.createElement("img");
  imgFondo.setAttribute("src", "images/road.png"); //El renderizado ocurre desde HTML y no JS, por tanto debemos pintar la ruta relativa a HTML!!
  //EQUIVALE A ESTO --> imgFondo.src = "images/road.png"

  const imgCoche = document.createElement("img");
  imgCoche.setAttribute("src", "images/car.png");

  //Posición inicial del coche:
  let x_coche = 220;
  let y_coche = 550;

  //Obstaculos:
  // let width_max_obstaculo = canvas.getAttribute("width") - 100; //--> ponemos -100 para asegurarnos que el coche pasa bien (podriamos ajustarlo más si queremos complicar el juego).
  // let width_obstaculo = Math.floor(Math.random() * width_max_obstaculo);
  // let x_obstaculo = Math.floor(Math.random() * (canvas.getAttribute("width"))-width_obstaculo) // --> le indicamos que queremos que la x inicial del obstaculo sea RANDOM pero siempre que el final del obstaculo sea el "canvas.width".
  // let y_obstaculo = -30 // --> como queremos que se generen fuera del canvas, le indicamos que la posición inicial en y sea (-canvas.height)

  let frames = 0; // --> *explicación el update().

  //Array de obstaculos 
  //-> Lo implementamos para poder tener más de un obstaculo a la vez. En cuanto implementamos esto en el codigo (class Obstaculo), deja de tener sentido la definición de parámetros en "Obstaculos" (por eso esta comentada).
  const obstaculos = [];



  document.getElementById('start-button').onclick = () => {
    startGame();
  };
  //EQUIVALE A ESTO (codigo inferior comentado): ------------------------
  /*const botonInicio = getElementById("start-button");
  botonInicio.addEventListener("click", () => {
    startGame();
  });*/

  let interval;

  function startGame() {
    //setInterval:
    return interval = setInterval (update, 20) ; //Cada 20ms, ejecuta función "update".
  }

  function update() {
    frames ++ // --> lo usamos para controlar cada cuanto soltamos un obstaculo, de este modo controlaremos la pericidad de los mismos.

    //LIMPIAR - limpia la imagen, ya sea el background, o elementos en el canvas.
    ctx.clearRect(0, 0, canvas.getAttribute("width"), canvas.getAttribute("height")); //--> Limpiamos la totalidad del canvas para poder repintar en posiciones nuevas.

    //RECALCULAR - recalcula la "posición" de los elementos que nos interesan del canvas. En este caso estara atado al tiempo(intervalo) y no al pulsado de teclas(eso ocurrirá en otro lado).
    //En este caso --> posición de los obstaculos.
    //Posición Obstaculos:
    //y_obstaculo += 5; // Hacemos que cada iteración te repinte el obstaculo x más abajo. Comentado pues lo usabamos para un solo obstaculo.
    //recorrer array de obstaculos y actualizas la y.
    obstaculos.forEach(obstaculo => {
      obstaculo.y += 5;
    })
    if(frames % 100 == 0){
      //crear obstaculo y meterlo en el array de obstaculos.
      let obstaculo = new Obstaculo();
      obstaculos.push(obstaculo);
    }

    //Comprovar colisiones:
    obstaculos.forEach(obstaculo => {
      obstaculo.choca();
    })   

    //REPINTAR - Repinta los elementos en el canvas en base a la recalculación.
    //En este caso --> fondo, coche, obstaculos.
    //Fondo:
    ctx.drawImage(imgFondo, 0, 0, canvas.width, canvas.height); // --> Método para dibujar imagenes en el canvas.
    //Tambiés podrías "(imgFondo, 0, 0, canvas.getAttribute("width)", canvas.getAttribute("height")) o "(imgFondo, 0, 0, 500, 700)".

    //Obstaculos:
    //ctx.fillRect(x, y, width_obstaculo, 30) // --> 30 es el height del obstaculo y decidimos sea fijo.Comentado pues esto era para el caso de un solo obstaculo.
    obstaculos.forEach(obstaculo => {
      obstaculo.pintar();
    })


    //Coche:
    ctx.drawImage(imgCoche, x_coche, y_coche, 60, 110); // --> Lo pintamos despues del fondo, pues sino lo tapará el mismo.
  }

  // Crear evento que mueva el "coche" lateralmente cuando presionamos una tecla. Como apretar una tecla NO actua sobre ningun elemento del HTML, el atributo KEYDOWN lo linkamos al "body" o incluso a la "window".
  document.body.addEventListener("keydown", (e) => {
    if (e.key == "ArrowRight"){
      if (x_coche < canvas.width-60){
        x_coche += 10;
      }
      // else if (x_coche == canvas.width-60){
      //   x_coche = canvas.width-60;
      // } --> NOT NEEDED
    }
    else if (e.key == "ArrowLeft"){
      if (x_coche > 0){
        x_coche -= 10;
      }  
      else if (x_coche == 0){
        x_coche = 0;
    }
  }
})

//CREAR CLASE:
//Creamos una clase para generar obstaculos periodicamente (si no lo hacemos así, no podremos printear mas de un obstaculo a la vez).
class Obstaculo {
  constructor () {
    let width_max_obstaculo = canvas.getAttribute("width") - 150;

    this.width = Math.floor(Math.random() * width_max_obstaculo);
    this.height = 30;
    this.x = Math.floor(Math.random() * (canvas.getAttribute("width"))- this.width);
    this.y = -30;
  }

  pintar() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  choca() {
    if (!((x_coche > (this.x + this.width)) || ((x_coche + 60) < this.x) || (y_coche > (this.y + this.height)) || ((y_coche + 110) < this.y))){
      clearInterval(interval);
    }
  }
}
}
