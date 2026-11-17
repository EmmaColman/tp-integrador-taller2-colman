export function registerReparacionFinalizadaListener({ eventBus, notifier }) {
  eventBus.on('reparacion.finalizada', async (reparacion) => {
    try {
      // await permite capturar tanto fallos inmediatos como promesas rechazadas.
      await notifier.notify(reparacion);
    } catch (error) {
      // Notificar es un efecto secundario: su fallo no debe afectar la finalización.
      console.error('No se pudo notificar la finalización de la reparación:', error?.message ?? String(error));
    }
  });
}
