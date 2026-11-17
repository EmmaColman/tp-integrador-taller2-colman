import { AppError } from '../errors/AppError.js';

export function makeReparacionesUseCases({ reparacionesDao, vehiculosDao, eventBus }) {
  async function getById(id) {
    const reparacion = await reparacionesDao.findById(id);
    if (!reparacion) {
      throw new AppError('REPARACION_NOT_FOUND', 'Reparación no encontrada', 404);
    }
    return reparacion;
  }

  return {
    list: () => reparacionesDao.findAll(),
    getById,
    async create(data) {
      // La reparación necesita un vehículo existente para no quedar sin referencia.
      const vehiculo = await vehiculosDao.findById(data.vehiculoId);
      if (!vehiculo) {
        throw new AppError('VEHICULO_NOT_FOUND', 'Vehículo no encontrado', 404);
      }
      // El cliente no decide la fecha, el estado inicial ni el trabajo vacío.
      return reparacionesDao.create({
        vehiculoId: data.vehiculoId,
        descripcionProblema: data.descripcionProblema,
        estado: 'pendiente',
        trabajoRealizado: '',
        fechaIngreso: new Date().toISOString(),
      });
    },
    async update(id, changes) {
      const current = await getById(id);
      // El cierre impide cualquier edición, incluso enviar los mismos valores.
      if (current.estado === 'finalizada') {
        throw new AppError('REPARACION_FINALIZADA', 'Una reparación finalizada no puede modificarse', 409);
      }

      const nextEstado = changes.estado ?? current.estado;
      const nextStates = { pendiente: 'en_proceso', en_proceso: 'finalizada' };
      // Repetir estado es válido; cambiarlo solo permite avanzar un paso.
      if (nextEstado !== current.estado && nextEstado !== nextStates[current.estado]) {
        throw new AppError('TRANSICION_INVALIDA', 'La transición de estado no está permitida', 409);
      }
      // Importa el estado previo: iniciar y registrar trabajo requieren dos peticiones.
      if (changes.trabajoRealizado !== undefined && current.estado !== 'en_proceso') {
        throw new AppError('TRABAJO_NO_PERMITIDO', 'Debe iniciar la reparación antes de registrar trabajo', 409);
      }
      // Al finalizar, sirve tanto el trabajo ya guardado como el enviado en este PATCH.
      const nextTrabajo = changes.trabajoRealizado ?? current.trabajoRealizado;
      if (nextEstado === 'finalizada' && nextTrabajo.trim().length === 0) {
        throw new AppError('TRABAJO_REQUERIDO', 'Debe registrar el trabajo realizado antes de finalizar', 409);
      }

      // Guardamos solo después de superar todas las reglas y luego emitimos el evento.
      const updated = await reparacionesDao.update(id, changes);
      if (current.estado === 'en_proceso' && updated?.estado === 'finalizada') {
        eventBus.emit('reparacion.finalizada', { ...updated });
      }
      return updated;
    },
    async delete(id) {
      await getById(id);
      await reparacionesDao.delete(id);
    },
  };
}
