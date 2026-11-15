import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import {
  createVehiculoSchema, updateVehiculoSchema, vehiculoParamsSchema, emptyQuerySchema,
} from '../schemas/vehiculoSchemas.js';

export function makeVehiculosRouter({ vehiculosController }) {
  const router = Router();
  const query = emptyQuerySchema;

  router.post('/', validate({ query, body: createVehiculoSchema }), vehiculosController.create);
  router.get('/', validate({ query }), vehiculosController.list);
  router.get('/:id', validate({ params: vehiculoParamsSchema, query }), vehiculosController.getById);
  router.patch('/:id', validate({ params: vehiculoParamsSchema, query, body: updateVehiculoSchema }), vehiculosController.update);
  router.delete('/:id', validate({ params: vehiculoParamsSchema, query }), vehiculosController.delete);

  return router;
}
