import { AppError } from '../errors/AppError.js';
import { withSqliteErrors } from './sqliteErrors.js';

export function makeVehiculosSqliteDao({ Vehiculo }) {
  return {
    // raw y get({ plain: true }) evitan entregar instancias de Sequelize a otras capas.
    findAll: () => Vehiculo.findAll({ raw: true, order: [['id', 'ASC']] }),
    findById: (id) => Vehiculo.findByPk(id, { raw: true }),
    findByPatente: (patente) => Vehiculo.findOne({ where: { patente }, raw: true }),
    create: (data) => withSqliteErrors(async () => {
      const vehiculo = await Vehiculo.create(data, { fields: ['patente', 'marca', 'modelo', 'anio'] });
      return vehiculo.get({ plain: true });
    }),
    update: (id, changes) => withSqliteErrors(async () => {
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) return null;
      await vehiculo.update(changes, { fields: ['patente', 'marca', 'modelo', 'anio'] });
      return vehiculo.get({ plain: true });
    }),
    delete: (id) => withSqliteErrors(async () => {
      return (await Vehiculo.destroy({ where: { id } })) > 0;
    }, new AppError('VEHICULO_CON_REPARACIONES', 'No se puede eliminar un vehículo con reparaciones', 409)),
  };
}
