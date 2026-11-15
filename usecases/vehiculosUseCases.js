import { AppError } from '../errors/AppError.js';

export function makeVehiculosUseCases({ vehiculosDao }) {
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
      await vehiculosDao.delete(id);
    },
  };
}
