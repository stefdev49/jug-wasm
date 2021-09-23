'use strict';
const fs = require('fs');
const WASI = require('wasi');
const wasi = new WASI({
  args: process.argv,
  env: process.env,
  preopens: {
    '/sandbox': '/tmp'
  }
});
const importObject = { wasi_snapshot_preview1: wasi.exports };

(async () => {
  const wasm = await WebAssembly.compile(fs.readFileSync('./out/bonjour.wasm'));
  const instance = await WebAssembly.instantiate(wasm, importObject);

  wasi.start(instance);
})();
