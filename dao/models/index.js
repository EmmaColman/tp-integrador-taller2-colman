import { DataTypes } from 'sequelize';

export function defineModels(sequelize) {
  const Vehiculo = sequelize.define('Vehiculo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patente: { type: DataTypes.STRING, allowNull: false, unique: true },
    marca: { type: DataTypes.STRING(50), allowNull: false },
    modelo: { type: DataTypes.STRING(50), allowNull: false },
    anio: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'vehiculos', timestamps: false });

  const Reparacion = sequelize.define('Reparacion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vehiculoId: { type: DataTypes.INTEGER, allowNull: false },
    descripcionProblema: { type: DataTypes.STRING(500), allowNull: false },
    trabajoRealizado: { type: DataTypes.STRING(500), allowNull: false },
    estado: { type: DataTypes.STRING, allowNull: false },
    fechaIngreso: { type: DataTypes.STRING, allowNull: false },
  }, { tableName: 'reparaciones', timestamps: false });

  Vehiculo.hasMany(Reparacion, {
    foreignKey: 'vehiculoId', as: 'reparaciones', onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  });
  Reparacion.belongsTo(Vehiculo, {
    foreignKey: 'vehiculoId', as: 'vehiculo', onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  });

  return { Vehiculo, Reparacion };
}
