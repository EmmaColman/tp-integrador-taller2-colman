import { AppError } from '../errors/AppError.js';

export function validate(schemas) {
  return (req, res, next) => {
    const validated = {};

    for (const [source, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(req[source]);
      if (!result.success) {
        return next(new AppError('VALIDATION_ERROR', 'Datos de entrada inválidos', 400,
          result.error.issues.map((issue) => ({
            path: [source, ...issue.path].join('.'),
            message: issue.message,
          }))));
      }
      validated[source] = result.data;
    }

    res.locals.validated = validated;
    next();
  };
}
