export function makeVehiculosController({ vehiculosUseCases }) {
  return {
    async create(req, res) {
      const vehiculo = await vehiculosUseCases.create(res.locals.validated.body);
      res.status(201).json(vehiculo);
    },
    async list(req, res) {
      res.json(await vehiculosUseCases.list());
    },
    async getById(req, res) {
      res.json(await vehiculosUseCases.getById(res.locals.validated.params.id));
    },
    async update(req, res) {
      const { params, body } = res.locals.validated;
      res.json(await vehiculosUseCases.update(params.id, body));
    },
    async delete(req, res) {
      await vehiculosUseCases.delete(res.locals.validated.params.id);
      res.status(204).end();
    },
  };
}
