#include <stdlib.h>
#include <stdio.h>
#include "emscripten.h"

/**
 * on veut implémenter processData(image.data, image.width, image.height);
 */
EMSCRIPTEN_KEEPALIVE
void processData(uint8_t *data, int width, int height)
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
  for (x = 0; x < width; x++)
  {
    for (y = 0; y < height; y++)
    {
      idx = (x + y * width) * 4;
      data[idx] = (data[idx] - min) * coeff;
      data[idx + 1] = (data[idx + 1] - min) * coeff;
      data[idx + 2] = (data[idx + 2] - min) * coeff;
    }
  }
}

EMSCRIPTEN_KEEPALIVE
uint8_t *allocBuffer(int width, int height)
{
  return malloc(width * height * 4 * sizeof(uint8_t));
}

EMSCRIPTEN_KEEPALIVE
void freeBuffer(uint8_t *p)
{
  free(p);
}
