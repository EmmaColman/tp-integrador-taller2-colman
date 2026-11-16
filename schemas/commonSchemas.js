import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'El ID debe ser un entero positivo')
    .transform(Number).pipe(z.number().int().positive().max(Number.MAX_SAFE_INTEGER)),
}).strict();

export const emptyQuerySchema = z.object({}).strict();
