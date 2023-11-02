export default class Notify {
  #timeoutId;
  notify(cb) {
    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
    }
    this.#timeoutId = setTimeout(() => {
      this.#timeoutId = null;
      cb();
    }, 2000);
  }
}
