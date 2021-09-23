#include <stdio.h>
#include <emscripten/emscripten.h>

#define WASM_EXPORT __attribute__((visibility("default")))

WASM_EXPORT
void bonjour(int n) {
    printf("Bonjour JUG!\n");
}
