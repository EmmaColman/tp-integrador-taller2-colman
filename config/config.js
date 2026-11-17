export const config = {
  port: Number(process.env.PORT) || 3000,
  persistenceType: process.env.PERSISTENCE_TYPE || 'memory',
  sqliteStorage: process.env.SQLITE_STORAGE || './data/taller.sqlite',
};
