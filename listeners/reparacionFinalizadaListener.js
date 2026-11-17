export function registerReparacionFinalizadaListener({ eventBus, notifier }) {
  eventBus.on('reparacion.finalizada', async (reparacion) => {
    try {
      await notifier.notify(reparacion);
    } catch (error) {
      console.error('No se pudo notificar la finalización de la reparación:', error?.message ?? String(error));
    }
  });
}
