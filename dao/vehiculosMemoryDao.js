export function makeVehiculosMemoryDao() {
  // El array y el contador pertenecen a esta instancia y se pierden al reiniciar.
  const vehiculos = [];
  let nextId = 1;

  return {
    async findAll() {
      // Devolvemos copias para evitar cambios al array desde otras capas.
      return vehiculos.map((vehiculo) => ({ ...vehiculo }));
    },
    async findById(id) {
      const vehiculo = vehiculos.find((item) => item.id === id);
      return vehiculo ? { ...vehiculo } : null;
    },
    async findByPatente(patente) {
      const vehiculo = vehiculos.find((item) => item.patente === patente);
      return vehiculo ? { ...vehiculo } : null;
    },
    async create(data) {
      const vehiculo = { ...data, id: nextId++ };
      vehiculos.push(vehiculo);
      return { ...vehiculo };
    },
    async update(id, changes) {
      const index = vehiculos.findIndex((item) => item.id === id);
      if (index === -1) return null;
      vehiculos[index] = { ...vehiculos[index], ...changes, id };
      return { ...vehiculos[index] };
    },
    async delete(id) {
      const index = vehiculos.findIndex((item) => item.id === id);
      if (index === -1) return false;
      vehiculos.splice(index, 1);
      return true;
    },
  };
}
