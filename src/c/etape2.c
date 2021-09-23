#include <stdlib.h>
#include <stdio.h>
#include "emscripten.h"

/**
 * on veut implémenter processData(image.data, image.width, image.height);
 */
EMSCRIPTEN_KEEPALIVE
int processData(uint8_t data, int width, int height) {
    fprintf(stdout, "Traitement d'une image %dx%d\n", width, height);
    return 123;
}

EMSCRIPTEN_KEEPALIVE
uint8_t* allocBuffer(int width, int height) {
  return malloc(width * height * 4 * sizeof(uint8_t));
}

EMSCRIPTEN_KEEPALIVE
void freeBuffer(uint8_t* p) {
  free(p);
}
