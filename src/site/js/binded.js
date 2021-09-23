'use strict';

/**
 * utilisation de la fonction processData qui se base sur du wasm 'bindé'
 * ATTENTION! la compilation est asynchrone et il faut 
 * tester que le module est bien disponible (compilation terminée).
 */

/*
Uncaught 
{…}
​
message: "Cannot call allocBuffer due to unbound types: Pv"
​
name: "UnboundTypeError"
​
stack: "UnboundTypeError: Cannot call allocBuffer due to unbound types: Pv\nextendError/errorClass<@http://127.0.0.1:8080/out/bind1.js:1746:24\nUnboundTypeError@http://127.0.0.1:8080/out/bind1.js line 1733 > Function:4:34\nthrowUnboundTypeError@http://127.0.0.1:8080/out/bind1.js:2268:13\n__embind_register_function/<@http://127.0.0.1:8080/out/bind1.js:2277:32\nprocessData@http://127.0.0.1:8080/src/site/js/binded.js:26:23\ntransformImage@http://127.0.0.1:8080/src/site/js/binded.js:53:14\nonclick@http://127.0.0.1:8080/src/site/bind1.html:1:15\n"
​
<prototype>: Object { constructor: UnboundTypeError(), toString: toString(), stack: "" }
bind1.js:2268:13

*/
var imgData;

function bonjour() {
  var c = document.getElementById('canvas');
  var ctx = c.getContext('2d');
  ctx.font = '30px Arial';
  ctx.fillText('Test !', 10, 50);
}

/**
 * Traite l'image en utilsant une fonction définie en webassembly
 * @param {*} data 
 * @param {*} width 
 * @param {*} heigth 
 */
function processData(data, width, heigth) {
  // alloue la mémoire
  // var buffer = Module.allocBuffer(width, heigth); -> ici UnboundTypeError: Cannot call allocBuffer due to unbound types: Pv
  var buffer = Module._malloc(width * heigth * 4);

  Module.passThrough(buffer);

  // copie les données
  Module.HEAPU8.set(data, buffer);

  // traite les données
  Module.equalize(buffer, width, heigth);

  // recopie le résultat
  const len = (buffer + width * heigth * 4)|0;
  var result = Module.HEAPU8.subarray(buffer, len);
  for(var i=0; i<len; i=(i+4)|0) {
    data[i]=result[i]|0;
    data[i+1]=result[i+1]|0;
    data[i+2]=result[i+2]|0;
  }

  // libère la mémoire
  Module._free(buffer);
}

/**
 * Transforme les données de l'image
 * @param {ImageData} image données à décaler
 */
function transformImage(image) {
  var start = new Date();
  processData(image.data, image.width, image.height);
  var end = new Date();
  var c = document.getElementById('canvas');
  var ctx = c.getContext('2d');
  ctx.putImageData(image, 0, 0);
  ctx.font = '30px Arial';
  ctx.fillStyle = "#ffffff";
  ctx.fillText(end.getTime() - start.getTime() + ' ms', 10, 50);
}

/**
 * Charge une image depuis l'URL passée en paramètre
 * @param {string} src URL de la source de l'image
 */
async function loadImage(src) {
  // charge l'image
  const imgBlob = await fetch(src).then(resp => resp.blob());
  const img = await createImageBitmap(imgBlob);

  // dimensionne le canvas
  const canvas = document.getElementById('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  // dessine l'image sur le canvas
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}
