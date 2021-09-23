#include <stdio.h>
#include <emscripten/emscripten.h>

int main(int argc, char ** argv) {
    printf("Testons l'appel d'une fonction\n");
}

/**
 * On peut rappeler des fonction javascripts depuis le code C
 */
EM_JS(void, javascript_depuis_c, (), {
  alert('on peut rappeler du javascript');
});

/**
 * EMSCRIPTEN_KEEPALIVE indique au compilateur de ne pas optimiser en supprimant la fonction.
 */
void EMSCRIPTEN_KEEPALIVE executer(int argc, char ** argv) {
    printf("executer() appelée...\n");
    javascript_depuis_c();
}
