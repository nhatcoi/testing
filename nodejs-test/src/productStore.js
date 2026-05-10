/** In-memory product store (same seed & rules as springboot-test). */

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

export function createProductStore() {
  const store = new Map();
  let idSeq = 1;

  function createInternal(name, category, price, stock) {
    const id = idSeq++;
    const p = { id, name, category, price, stock };
    store.set(id, p);
    return { ...p };
  }

  function seed() {
    createInternal('Laptop', 'electronics', 1299.99, 5);
    createInternal('Desk Chair', 'furniture', 199.0, 12);
    createInternal('Notebook', 'stationery', 4.5, 100);
  }

  seed();

  return {
    findAll() {
      return [...store.values()].sort((a, b) => a.id - b.id).map((p) => ({ ...p }));
    },

    findById(id) {
      const p = store.get(Number(id));
      if (!p) throw new NotFoundError(`Product not found: ${id}`);
      return { ...p };
    },

    create(body) {
      return createInternal(body.name, body.category, Number(body.price), body.stock);
    },

    update(id, body) {
      const existing = store.get(Number(id));
      if (!existing) throw new NotFoundError(`Product not found: ${id}`);
      existing.name = body.name;
      existing.category = body.category;
      existing.price = Number(body.price);
      existing.stock = body.stock;
      return { ...existing };
    },

    delete(id) {
      if (!store.delete(Number(id))) {
        throw new NotFoundError(`Product not found: ${id}`);
      }
    },

    findByCategory(category) {
      const c = category.toLowerCase();
      return [...store.values()]
        .filter((p) => p.category.toLowerCase() === c)
        .sort((a, b) => a.id - b.id)
        .map((p) => ({ ...p }));
    },

    searchByName(q) {
      if (q == null || String(q).trim() === '') return this.findAll();
      const needle = String(q).toLowerCase();
      return [...store.values()]
        .filter((p) => p.name.toLowerCase().includes(needle))
        .sort((a, b) => a.id - b.id)
        .map((p) => ({ ...p }));
    },

    count() {
      return store.size;
    },

    patchPrice(id, price) {
      const p = store.get(Number(id));
      if (!p) throw new NotFoundError(`Product not found: ${id}`);
      p.price = Number(price);
      return { ...p };
    },

    exists(id) {
      return store.has(Number(id));
    },

    adjustStock(id, delta) {
      const p = store.get(Number(id));
      if (!p) throw new NotFoundError(`Product not found: ${id}`);
      const next = p.stock + Number(delta);
      if (next < 0) {
        const err = new Error('Stock cannot be negative');
        err.status = 400;
        throw err;
      }
      p.stock = next;
      return { ...p };
    },
  };
}
