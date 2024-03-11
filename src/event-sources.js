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
      this.#event = null;
    }
  }

  connect(cb) {
    this.close();
    const event = new EventSource(`/api/invites/${this.#t}/${this.#mat}/updates`);
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

export class SummaryEvents {
  #event;
  #t;

  constructor(t) {
    this.#t = t;
  }

  close() {
    if (this.#event) {
      this.#event.close();
      this.#event = null;
    }
  }

  connect(cb) {
    this.close();
    const event = new EventSource(`/api/invites/${this.#t}/summary`);
    event.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        cb(data);
      } catch (err) {
        cb({ error: err.message });
      }
    }
    this.#event = event;
  }
}
