import { describe, expect, it, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createProductStore } from '../src/productStore.js';

describe('Product API', () => {
  let app;

  beforeEach(() => {
    app = createApp(createProductStore());
  });

  it('GET /api/products returns list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  it('GET /api/products/999999 returns 404', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.status).toBe(404);
  });

  it('POST /api/products creates', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'API Pen', category: 'stationery', price: 2.5, stock: 20 });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('API Pen');
    expect(res.body.id).toBeDefined();
  });

  it('GET /api/products/count', async () => {
    const res = await request(app).get('/api/products/count');
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThanOrEqual(3);
  });

  it('GET /api/products/1/exists', async () => {
    const res = await request(app).get('/api/products/1/exists');
    expect(res.status).toBe(200);
    expect(res.body.exists).toBe(true);
  });

  it('CRUD flow', async () => {
    const createRes = await request(app)
      .post('/api/products')
      .send({ name: 'Temp', category: 'misc', price: 10, stock: 1 });
    expect(createRes.status).toBe(201);
    const id = createRes.body.id;

    const putRes = await request(app)
      .put(`/api/products/${id}`)
      .send({ name: 'Temp2', category: 'misc', price: 11, stock: 2 });
    expect(putRes.status).toBe(200);
    expect(putRes.body.name).toBe('Temp2');

    const patchRes = await request(app)
      .patch(`/api/products/${id}/price`)
      .send({ price: 9.99 });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.price).toBe(9.99);

    await request(app).delete(`/api/products/${id}`).expect(204);

    const gone = await request(app).get(`/api/products/${id}`);
    expect(gone.status).toBe(404);
  });
});
