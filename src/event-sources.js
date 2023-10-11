export class UpdateEvents {
  #event;
  #mat;
  #t;

  constructor(mat, t) {
    this.#t = t;
    this.#mat = mat;
  }

  close() {
    if (this.#event) {
      this.#event.close();
    }
  }

  connect(cb) {
    this.close();
    const event = new EventSource(`/api/${this.#mat}/updates?token=${this.#t}`);
    event.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        cb(data);
      } catch (err) {
        cb({ error: err.message });
      }
    };
    this.#event = event;
  }
}
