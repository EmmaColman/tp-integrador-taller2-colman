import { beforeEach, describe, expect, it } from 'vitest';
import { EventEmitter } from 'node:events';
import { makeVehiculosMemoryDao } from '../dao/vehiculosMemoryDao.js';
import { makeReparacionesMemoryDao } from '../dao/reparacionesMemoryDao.js';
import { makeVehiculosUseCases } from '../usecases/vehiculosUseCases.js';
import { makeReparacionesUseCases } from '../usecases/reparacionesUseCases.js';
import { AppError } from '../errors/AppError.js';

describe('Reglas de negocio del taller', () => {
  let vehiculosUseCases;
  let reparacionesUseCases;
  let vehiculo;

  beforeEach(async () => {
    // Cada prueba empieza con sus propios arrays y dependencias.
    const vehiculosDao = makeVehiculosMemoryDao();
    const reparacionesDao = makeReparacionesMemoryDao();
    const eventBus = new EventEmitter();
    vehiculosUseCases = makeVehiculosUseCases({ vehiculosDao, reparacionesDao });
    reparacionesUseCases = makeReparacionesUseCases({ vehiculosDao, reparacionesDao, eventBus });
    vehiculo = await vehiculosUseCases.create({
      patente: 'AB 123 CD', marca: 'Toyota', modelo: 'Etios', anio: 2018,
    });
  });

  it('rechaza registrar un vehículo con una patente duplicada', async () => {
    const operacion = vehiculosUseCases.create({
      patente: vehiculo.patente, marca: 'Ford', modelo: 'Ka', anio: 2019,
    });

    await expect(operacion).rejects.toBeInstanceOf(AppError);
    await expect(operacion).rejects.toMatchObject({
      code: 'PATENTE_DUPLICADA', statusCode: 409,
    });
    expect(await vehiculosUseCases.list()).toEqual([vehiculo]);
  });

  it('rechaza crear una reparación para un vehículo inexistente', async () => {
    const operacion = reparacionesUseCases.create({
      vehiculoId: vehiculo.id + 1, descripcionProblema: 'Ruido al frenar',
    });

    await expect(operacion).rejects.toBeInstanceOf(AppError);
    await expect(operacion).rejects.toMatchObject({
      code: 'VEHICULO_NOT_FOUND', statusCode: 404,
    });
    expect(await reparacionesUseCases.list()).toEqual([]);
  });

  it('rechaza pasar directamente de pendiente a finalizada', async () => {
    const reparacion = await reparacionesUseCases.create({
      vehiculoId: vehiculo.id, descripcionProblema: 'Ruido al frenar',
    });
    const operacion = reparacionesUseCases.update(reparacion.id, { estado: 'finalizada' });

    await expect(operacion).rejects.toBeInstanceOf(AppError);
    await expect(operacion).rejects.toMatchObject({
      code: 'TRANSICION_INVALIDA', statusCode: 409,
    });
    expect(await reparacionesUseCases.getById(reparacion.id)).toEqual(reparacion);
  });

  it('rechaza finalizar una reparación sin trabajo realizado', async () => {
    const reparacion = await reparacionesUseCases.create({
      vehiculoId: vehiculo.id, descripcionProblema: 'Ruido al frenar',
    });
    const iniciada = await reparacionesUseCases.update(reparacion.id, { estado: 'en_proceso' });
    const operacion = reparacionesUseCases.update(reparacion.id, { estado: 'finalizada' });

    await expect(operacion).rejects.toBeInstanceOf(AppError);
    await expect(operacion).rejects.toMatchObject({
      code: 'TRABAJO_REQUERIDO', statusCode: 409,
    });
    expect(await reparacionesUseCases.getById(reparacion.id)).toEqual(iniciada);
  });

  it('rechaza eliminar un vehículo que tiene reparaciones', async () => {
    const reparacion = await reparacionesUseCases.create({
      vehiculoId: vehiculo.id, descripcionProblema: 'Ruido al frenar',
    });
    const operacion = vehiculosUseCases.delete(vehiculo.id);

    await expect(operacion).rejects.toBeInstanceOf(AppError);
    await expect(operacion).rejects.toMatchObject({
      code: 'VEHICULO_CON_REPARACIONES', statusCode: 409,
    });
    expect(await vehiculosUseCases.getById(vehiculo.id)).toEqual(vehiculo);
    expect(await reparacionesUseCases.getById(reparacion.id)).toEqual(reparacion);
  });

  it('permite pasar de pendiente a en proceso conservando los demás datos', async () => {
    const reparacion = await reparacionesUseCases.create({
      vehiculoId: vehiculo.id, descripcionProblema: 'Ruido al frenar',
    });

    const actualizada = await reparacionesUseCases.update(reparacion.id, { estado: 'en_proceso' });

    expect(actualizada).toEqual({ ...reparacion, estado: 'en_proceso' });
    expect(await reparacionesUseCases.getById(reparacion.id)).toEqual(actualizada);
  });
});
