export function makeReparacionesMemoryDao() {
  const reparaciones = [];
  let nextId = 1;

  return {
    async findAll() {
      return reparaciones.map((reparacion) => ({ ...reparacion }));
    },
    async findById(id) {
      const reparacion = reparaciones.find((item) => item.id === id);
      return reparacion ? { ...reparacion } : null;
    },
    async existsByVehiculoId(vehiculoId) {
      return reparaciones.some((item) => item.vehiculoId === vehiculoId);
    },
    async create(data) {
      const reparacion = { ...data, id: nextId++ };
      reparaciones.push(reparacion);
      return { ...reparacion };
    },
    async update(id, changes) {
      const index = reparaciones.findIndex((item) => item.id === id);
      if (index === -1) return null;
      const current = reparaciones[index];
      reparaciones[index] = {
        ...current, ...changes,
        id: current.id, vehiculoId: current.vehiculoId, fechaIngreso: current.fechaIngreso,
      };
      return { ...reparaciones[index] };
    },
    async delete(id) {
      const index = reparaciones.findIndex((item) => item.id === id);
      if (index === -1) return false;
      reparaciones.splice(index, 1);
      return true;
    },
  };
}
