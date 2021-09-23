// quick_example.cpp
#include <emscripten/bind.h>

using namespace emscripten;

float lerp(float a, float b, float t) {
    return (1 - t) * a + t * b;
}

class C {};
C* passThrough(C* ptr) { return ptr; }

EMSCRIPTEN_BINDINGS(my_module) {
    function("lerp", &lerp);
    class_<C>("C");
    function("passThrough", &passThrough, allow_raw_pointers());
}
