export function makeConsoleNotifier() {
  return {
    notify(reparacion) {
      console.log(`Reparación ${reparacion.id} del vehículo ${reparacion.vehiculoId} finalizada: ${reparacion.trabajoRealizado}`);
    },
  };
}
