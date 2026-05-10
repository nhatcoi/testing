import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { NotFoundError } from '../productStore.js';

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors
      .array()
      .map((e) => `${e.path}: ${e.msg}`)
      .join('; ');
    res.status(400).json({ error: msg });
    return true;
  }
  return false;
}

function run(store, fn) {
  return (req, res, next) => {
    try {
      fn(req, res);
    } catch (e) {
      next(e);
    }
  };
}

const productBody = [
  body('name').trim().notEmpty().isLength({ max: 200 }),
  body('category').trim().notEmpty().isLength({ max: 100 }),
  body('price').isFloat({ min: 0.01 }),
  body('stock').isInt({ min: 0 }),
];

const priceBody = [body('price').isFloat({ min: 0.01 })];

export function createProductRouter(store) {
  const router = Router();

  router.get(
    '/',
    run(store, (_req, res) => {
      res.json(store.findAll());
    }),
  );

  router.get(
    '/count',
    run(store, (_req, res) => {
      res.json({ count: store.count() });
    }),
  );

  router.get(
    '/search',
    run(store, (req, res) => {
      res.json(store.searchByName(req.query.q));
    }),
  );

  router.get(
    '/category/:category',
    run(store, (req, res) => {
      res.json(store.findByCategory(req.params.category));
    }),
  );

  router.get(
    '/:id/exists',
    param('id').isInt({ min: 1 }),
    run(store, (req, res) => {
      if (handleValidation(req, res)) return;
      res.json({ exists: store.exists(req.params.id) });
    }),
  );

  router.patch(
    '/:id/price',
    param('id').isInt({ min: 1 }),
    priceBody,
    run(store, (req, res) => {
      if (handleValidation(req, res)) return;
      res.json(store.patchPrice(req.params.id, req.body.price));
    }),
  );

  router.patch(
    '/:id/stock',
    param('id').isInt({ min: 1 }),
    query('delta').isInt(),
    run(store, (req, res) => {
      if (handleValidation(req, res)) return;
      res.json(store.adjustStock(req.params.id, req.query.delta));
    }),
  );

  router.get(
    '/:id',
    param('id').isInt({ min: 1 }),
    run(store, (req, res) => {
      if (handleValidation(req, res)) return;
      res.json(store.findById(req.params.id));
    }),
  );

  router.post(
    '/',
    productBody,
    run(store, (req, res) => {
      if (handleValidation(req, res)) return;
      res.status(201).json(store.create(req.body));
    }),
  );

  router.put(
    '/:id',
    param('id').isInt({ min: 1 }),
    productBody,
    run(store, (req, res) => {
      if (handleValidation(req, res)) return;
      res.json(store.update(req.params.id, req.body));
    }),
  );

  router.delete(
    '/:id',
    param('id').isInt({ min: 1 }),
    run(store, (req, res) => {
      if (handleValidation(req, res)) return;
      store.delete(req.params.id);
      res.status(204).send();
    }),
  );

  router.use((err, _req, res, next) => {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  });

  return router;
}
