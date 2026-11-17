import { UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';
import { AppError } from '../errors/AppError.js';

export async function withSqliteErrors(operation, foreignKeyError) {
  try {
    return await operation();
  } catch (error) {
    // Traducimos restricciones de SQLite al mismo formato de error de la aplicación.
    if (error instanceof UniqueConstraintError) {
      throw new AppError('PATENTE_DUPLICADA', 'La patente ya está registrada', 409);
    }
    if (error instanceof ForeignKeyConstraintError && foreignKeyError) {
      throw foreignKeyError;
    }
    throw error;
  }
}
