'use strict';

var imgData;

function bonjour() {
  var c = document.getElementById('canvas');
  var ctx = c.getContext('2d');
  ctx.font = '30px Arial';
  ctx.fillText('Test !', 10, 50);
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
