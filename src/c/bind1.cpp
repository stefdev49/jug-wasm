#include <stdlib.h>
#include <stdio.h>
#include "emscripten.h"
#include "emscripten/bind.h"

using namespace emscripten;

/**
 * on veut implémenter processData(image.data, image.width, image.height);
 * On a l'erreur : "Implicitly binding raw pointers is illegal
 */
void equalize(uint8_t data[], int width, int height)
{
  int val;
  int idx;
  uint8_t map[256];

  // on compte les gris
  int x;
  int y;
  for (x = 0; x < width; x++)
  {
    for (y = 0; y < height; y++)
    {
      idx = (x + y * width) * 4;
      val = data[idx];
      val += data[idx + 1];
      val += data[idx + 2];
      map[val /= 3]++;
    }
  }

  // on trouve l'index max
  int max = 255;
  while (map[max] < 10)
  {
    max--;
  }

  // on trouve l'index min
  int min = 0;
  while (map[min] < 10)
  {
    min++;
  }

  // on "dilate la couleur"
  float coeff = 255.0 / (max - min);
  float valeur;
  for (x = 0; x < width; x++)
  {
    for (y = 0; y < height; y++)
    {
      idx = (x + y * width) * 4;
      valeur = (data[idx] - min) * coeff;
      if(valeur>255)
        valeur=255;
      data[idx] = valeur;
            valeur = (data[idx+1] - min) * coeff;
      if(valeur>255)
        valeur=255;
      data[idx + 1] = valeur;
            valeur = (data[idx+2] - min) * coeff;
      if(valeur>255)
        valeur=255;
      data[idx + 2] = valeur;
    }
  }
}

/*
 * https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#interacting-with-code-access-memory
 */

class C {};
C* passThrough(C* ptr) { return ptr; }

EMSCRIPTEN_BINDINGS(my_module) {
  class_<C>("C");
  // allow_raw_pointers() permet le passage du pointeur sur la zone mémoire
  // sinon comme la compilation échoue car il n'y a pas de sémantique par défaut
  function("equalize", &equalize, allow_raw_pointers());
  function("passThrough", &passThrough, allow_raw_pointers());
}
