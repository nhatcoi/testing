import { describe, expect, it } from 'vitest';
import { NotFoundError, createProductStore } from '../src/productStore.js';

describe('createProductStore', () => {
  it('seeds at least three products', () => {
    const store = createProductStore();
    expect(store.findAll().length).toBeGreaterThanOrEqual(3);
  });

  it('findById throws for unknown id', () => {
    const store = createProductStore();
    expect(() => store.findById(999_999)).toThrow(NotFoundError);
  });

  it('create and findById', () => {
    const store = createProductStore();
    const created = store.create({
      name: 'Test Mug',
      category: 'home',
      price: 12.34,
      stock: 7,
    });
    expect(created.id).toBeGreaterThan(0);
    expect(store.findById(created.id).name).toBe('Test Mug');
  });

  it('searchByName filters', () => {
    const store = createProductStore();
    const r = store.searchByName('lap');
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].name.toLowerCase()).toContain('lap');
  });

  it('patchPrice updates', () => {
    const store = createProductStore();
    const first = store.findAll()[0];
    const updated = store.patchPrice(first.id, 1);
    expect(updated.price).toBe(1);
  });

  it('adjustStock rejects negative result', () => {
    const store = createProductStore();
    const first = store.findAll()[0];
    expect(() => store.adjustStock(first.id, -(first.stock + 1))).toThrow(
      /Stock cannot be negative/,
    );
  });
});
