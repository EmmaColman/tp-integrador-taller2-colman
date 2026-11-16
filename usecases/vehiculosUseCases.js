import { AppError } from '../errors/AppError.js';

export function makeVehiculosUseCases({ vehiculosDao, reparacionesDao }) {
  async function getById(id) {
    const vehiculo = await vehiculosDao.findById(id);
    if (!vehiculo) {
      throw new AppError('VEHICULO_NOT_FOUND', 'Vehículo no encontrado', 404);
    }
    return vehiculo;
  }

  async function checkPatente(patente, currentId) {
    const existing = await vehiculosDao.findByPatente(patente);
    if (existing && existing.id !== currentId) {
      throw new AppError('PATENTE_DUPLICADA', 'La patente ya está registrada', 409);
    }
  }

  return {
    list: () => vehiculosDao.findAll(),
    getById,
    async create(data) {
      await checkPatente(data.patente);
      return vehiculosDao.create(data);
    },
    async update(id, changes) {
      await getById(id);
      if (changes.patente !== undefined) await checkPatente(changes.patente, id);
      return vehiculosDao.update(id, changes);
    },
    async delete(id) {
      await getById(id);
      if (await reparacionesDao.existsByVehiculoId(id)) {
        throw new AppError('VEHICULO_CON_REPARACIONES', 'No se puede eliminar un vehículo con reparaciones', 409);
      }
      await vehiculosDao.delete(id);
    },
  };
}
