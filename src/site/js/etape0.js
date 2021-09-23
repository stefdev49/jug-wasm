'use strict';

/**
 * Traite les données d'une image
 * @param {Uint8Array} data données de l'image
 * @param {*} width largeur de l'image
 * @param {*} height hauteur de l'image
 */
function processData(data, width, height) {
  var val;
  var idx;
  var map = new Float32Array(256);
  // on compte les gris
  for (var x = 0; x < width; x++)
    for (var y = 0; y < height; y++) {
      idx = (x + y * width) * 4;
      val = data[idx];
      val += data[idx + 1];
      val += data[idx + 2];
      map[val /= 3]++;
    }

  // on trouve l'index max
  var max = 255;
  while (map[max] < 10) {
    max--;
  }

  // on trouve l'index min
  var min = 0;
  while (map[min] < 10) {
    min++;
  }

  // on "dilate la couleur"
  var coeff = 255.0 / (max - min);
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      idx = (x + y * width) * 4;
      data[idx    ] = (data[idx    ] - min) * coeff;
      data[idx + 1] = (data[idx + 1] - min) * coeff;
      data[idx + 2] = (data[idx + 2] - min) * coeff;
    }
  }
}
