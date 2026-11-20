import { AppError } from '../errors/AppError.js';
import { withSqliteErrors } from './sqliteErrors.js';

export function makeReparacionesSqliteDao({ Reparacion }) {
  const missingVehiculo = () => new AppError('VEHICULO_NOT_FOUND', 'Vehículo no encontrado', 404);

  return {
    findAll: () => Reparacion.findAll({ raw: true, order: [['id', 'ASC']] }),
    findById: (id) => Reparacion.findByPk(id, { raw: true }),
    existsByVehiculoId: async (vehiculoId) => (await Reparacion.count({ where: { vehiculoId } })) > 0,
    create: (data) => withSqliteErrors(async () => {
      const reparacion = await Reparacion.create(data, {
        fields: ['vehiculoId', 'descripcionProblema', 'trabajoRealizado', 'estado', 'fechaIngreso'],
      });
      return reparacion.get({ plain: true });
    }, missingVehiculo()),
    update: (id, changes) => withSqliteErrors(async () => {
      const reparacion = await Reparacion.findByPk(id);
      if (!reparacion) return null;
      // La lista de campos deja fuera ID, vehículo y fecha de ingreso
      await reparacion.update(changes, { fields: ['descripcionProblema', 'trabajoRealizado', 'estado'] });
      return reparacion.get({ plain: true });
    }, missingVehiculo()),
    delete: async (id) => (await Reparacion.destroy({ where: { id } })) > 0,
  };
}
