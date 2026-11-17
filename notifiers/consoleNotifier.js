export function makeConsoleNotifier() {
  // Otro notificador puede ofrecer el mismo método notify sin cambiar el caso de uso.
  return {
    notify(reparacion) {
      console.log(`Reparación ${reparacion.id} del vehículo ${reparacion.vehiculoId} finalizada: ${reparacion.trabajoRealizado}`);
    },
  };
}
