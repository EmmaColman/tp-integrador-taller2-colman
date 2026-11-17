import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Sequelize } from 'sequelize';
import { defineModels } from '../dao/models/index.js';

export async function connectSqlite(storage) {
  if (storage !== ':memory:') await mkdir(dirname(resolve(storage)), { recursive: true });
  const sequelize = new Sequelize({ dialect: 'sqlite', storage, logging: false });
  try {
    const models = defineModels(sequelize);
    await sequelize.authenticate();
    await sequelize.query('PRAGMA foreign_keys = ON');
    // Crea las tablas faltantes sin borrar las existentes ni sus datos.
    await sequelize.sync();
    return { sequelize, ...models };
  } catch (error) {
    await sequelize.close();
    throw error;
  }
}
