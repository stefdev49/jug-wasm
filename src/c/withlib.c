#include <stdlib.h>
#include <stdio.h>
#include "emscripten.h"
#include "processing.h"

/**
 * on veut implémenter processData(image.data, image.width, image.height);
 */
EMSCRIPTEN_KEEPALIVE
void processData(uint8_t *data, int width, int height)
{
  return equalize(data, width, height);
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
