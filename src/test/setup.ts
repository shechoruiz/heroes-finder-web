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
