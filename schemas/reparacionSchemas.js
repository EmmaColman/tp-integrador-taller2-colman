import { z } from 'zod';

const descripcionProblema = z.string().trim().min(1, 'La descripción es obligatoria').max(500);

export const createReparacionSchema = z.object({
  vehiculoId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  descripcionProblema,
}).strict();

export const updateReparacionSchema = z.object({
  descripcionProblema: descripcionProblema.optional(),
  trabajoRealizado: z.string().trim().max(500).optional(),
  estado: z.enum(['pendiente', 'en_proceso', 'finalizada']).optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  'Debe enviar al menos un campo',
);
