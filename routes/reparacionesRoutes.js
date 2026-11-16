import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { idParamsSchema, emptyQuerySchema } from '../schemas/commonSchemas.js';
import { createReparacionSchema, updateReparacionSchema } from '../schemas/reparacionSchemas.js';

export function makeReparacionesRouter({ reparacionesController }) {
  const router = Router();
  const params = idParamsSchema;
  const query = emptyQuerySchema;

  router.post('/', validate({ query, body: createReparacionSchema }), reparacionesController.create);
  router.get('/', validate({ query }), reparacionesController.list);
  router.get('/:id', validate({ params, query }), reparacionesController.getById);
  router.patch('/:id', validate({ params, query, body: updateReparacionSchema }), reparacionesController.update);
  router.delete('/:id', validate({ params, query }), reparacionesController.delete);

  return router;
}
