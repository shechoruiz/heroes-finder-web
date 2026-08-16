// jsdom no implementa ResizeObserver; radix-ui (Accordion, Slider) lo usa.
// Este polyfill mínimo cubre la API que los componentes invocan en tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

// Workaround Node 24 + vitest v3 + jsdom (vitest-dev/vitest#8374):
// jsdom sobreescribe AbortController/AbortSignal con los suyos, pero
// Request/fetch globales siguen siendo de undici v7, que valida que la
// signal sea una instancia de SU AbortSignal. React Router v7 crea
// `new Request(url, { signal })` en cada navegación -> mismatch de realms.
// Envolvemos Request para omitir la signal en el constructor y re-asignarla
// después (los tests nunca abortan). Vitest v4 corrige esto nativamente.
const OriginalRequest = globalThis.Request;

class CompatRequest extends OriginalRequest {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    if (init && init.signal) {
      const { signal, ...rest } = init;
      super(input, rest);
      Object.defineProperty(this, "signal", {
        value: signal,
        configurable: true,
      });
    } else {
      super(input, init);
    }
  }
}

globalThis.Request = CompatRequest as unknown as typeof Request;
