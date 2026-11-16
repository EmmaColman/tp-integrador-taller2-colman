export function makeReparacionesController({ reparacionesUseCases }) {
  return {
    async create(req, res) {
      const reparacion = await reparacionesUseCases.create(res.locals.validated.body);
      res.status(201).json(reparacion);
    },
    async list(req, res) {
      res.json(await reparacionesUseCases.list());
    },
    async getById(req, res) {
      res.json(await reparacionesUseCases.getById(res.locals.validated.params.id));
    },
    async update(req, res) {
      const { params, body } = res.locals.validated;
      res.json(await reparacionesUseCases.update(params.id, body));
    },
    async delete(req, res) {
      await reparacionesUseCases.delete(res.locals.validated.params.id);
      res.status(204).end();
    },
  };
}
