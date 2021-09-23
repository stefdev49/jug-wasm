all: etape1 etape2 etape3 etape4 etape5 etape6

etape1: out/hello.html out/hello_function.html
etape2: out/etape2.js
etape3: out/debug.js
etape4: out/final.js
etape5: out/withlib.js out/libprocessing.a
etape6: out/quick_example.js

default: all

SELF_DIR := $(PWD)
export EMSDK := $(SELF_DIR)/tools/emsdk
export EM_CONFIG := $(EMSDK)/.emscripten
export EM_CACHE := $(EMSDK)/upstream/emscripten/cache
export EMSDK_NODE := $(EMSDK)/node/12.18.1_64bit/bin/node

export PATH := $(PATH):$(EMSDK):$(EMSDK)/upstream/emscripten:$(EMSDK)/node/12.18.1_64bit/bin

#
# on appelle le main()
#
out/hello.html: src/c/hello.c
	emcc $< -s WASM=1 -o $@

#
# on peut préciser le squelette du html
#
out/hello_function.html: src/c/hello_function.c src/template/shell_minimal.html
	emcc $< -s WASM=1 -o $@ --shell-file src/template/shell_minimal.html -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']"

#
# mise en place du squelette
#
out/etape2.js: src/c/etape2.c
	emcc $< -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -o $@

#
# on appelle le traitement réel
#
out/final.js: src/c/final.c
	emcc $< -s WASM=1 -O3 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -o $@

# création d'une librairie statique (avec gcc/ar/ranlib ça ne marche pas car le format du binaire n'est pas le bon)
# out/libprocessing.a: src/c/processing.c src/c/processing.h
# 	gcc -c $< -o out/processing.o
# 	ar rcs out/libprocessing.a out/processing.o
# 	ranlib out/libprocessing.a
out/libprocessing.a: src/c/processing.c src/c/processing.h
	emcc -c $< -o out/processing.o
	emar rcs out/libprocessing.a out/processing.o
	emranlib out/libprocessing.a

#
# code d'appel
#
out/withlib.js: src/c/withlib.c out/libprocessing.a
	emcc $< -s WASM=1 -O3 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -Lout -lprocessing -o $@

# on met  --source-map-base http://127.0.0.1:8080/out/ car le résultat est dans ../out par rapport au source
# si on émet dans le même répertoire on n'aura pas ce problème
# -g4 pour créer le sourcemap séparé
out/debug.js: src/c/debug.c
	emcc $< -s WASM=1 -g4 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' --source-map-base http://127.0.0.1:8080/out/ -o $@

#
# on passe l'option --bind
#
out/bind1.js: src/c/bind1.cpp
	emcc $< -s WASM=1 --bind -o $@

out/quick_example.js: src/c/quick_example.cpp
	emcc --bind -o $@ $<

.PHONY: clean

clean:
	rm -f out/*
