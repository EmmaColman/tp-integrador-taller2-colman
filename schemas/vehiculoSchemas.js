import { z } from 'zod';

const requiredText = z.string().trim().min(1, 'El texto es obligatorio');
const vehiculoFields = {
  patente: requiredText.toUpperCase(),
  marca: requiredText.max(50),
  modelo: requiredText.max(50),
  anio: z.number().int().min(1900).refine(
    (anio) => anio <= new Date().getFullYear() + 1,
    'El año no puede superar el año actual más uno',
  ),
};

export const createVehiculoSchema = z.object(vehiculoFields).strict();
export const updateVehiculoSchema = createVehiculoSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'Debe enviar al menos un campo',
);
export const vehiculoParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'El ID debe ser un entero positivo')
    .transform(Number).pipe(z.number().int().positive().max(Number.MAX_SAFE_INTEGER)),
}).strict();
export const emptyQuerySchema = z.object({}).strict();
