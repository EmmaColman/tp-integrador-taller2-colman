import { makeVehiculosMemoryDao } from './vehiculosMemoryDao.js';
import { makeReparacionesMemoryDao } from './reparacionesMemoryDao.js';

export async function makeDaos(config) {
  if (config.persistenceType === 'memory') {
    return {
      vehiculosDao: makeVehiculosMemoryDao(),
      reparacionesDao: makeReparacionesMemoryDao(),
      close: async () => {},
    };
  }
  if (config.persistenceType === 'sqlite') {
    const { connectSqlite } = await import('../config/sqlite.js');
    const { makeVehiculosSqliteDao } = await import('./vehiculosSqliteDao.js');
    const { makeReparacionesSqliteDao } = await import('./reparacionesSqliteDao.js');
    const { sequelize, Vehiculo, Reparacion } = await connectSqlite(config.sqliteStorage);
    return {
      vehiculosDao: makeVehiculosSqliteDao({ Vehiculo }),
      reparacionesDao: makeReparacionesSqliteDao({ Reparacion }),
      close: () => sequelize.close(),
    };
  }
  throw new Error('PERSISTENCE_TYPE debe ser memory o sqlite');
}
