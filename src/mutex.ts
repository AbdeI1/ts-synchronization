class Mutex {
  #l: boolean = false;
  #q: ((a: void | PromiseLike<void>) => void)[] = [];
  lock(): Promise<void> {
    if (this.#l)
      return new Promise(r => {
        this.#q.push(r);
      });
    this.#l = true;
    return Promise.resolve();
  }
  unlock() {
    if (this.#q.length > 0) this.#q.shift()!();
    if (this.#q.length == 0) this.#l = false;
  }
}

export { Mutex };
