import { AppError } from '../errors/AppError.js';

// Express reconoce un middleware de errores por sus cuatro parámetros
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.type === 'entity.parse.failed') {
    err = new AppError('INVALID_JSON', 'El cuerpo debe ser JSON válido', 400);
  }

  // Los errores inesperados se registran en el servidor sin exponer sus detalles al cliente
  const knownError = err instanceof AppError;
  const status = knownError ? err.statusCode : 500;
  const error = {
    code: knownError ? err.code : 'INTERNAL_ERROR',
    message: knownError ? err.message : 'Error interno del servidor',
  };
  if (knownError && err.details) error.details = err.details;
  if (!knownError) console.error(err);

  res.status(status).json({ error });
}
