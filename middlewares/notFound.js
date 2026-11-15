import { AppError } from '../errors/AppError.js';

export function notFound(req, res, next) {
  next(new AppError('ROUTE_NOT_FOUND', 'Ruta no encontrada', 404));
}
