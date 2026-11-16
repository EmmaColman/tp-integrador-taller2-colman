import express from 'express';
import { router } from '../routes/index.js';
import { makeVehiculosMemoryDao } from '../dao/vehiculosMemoryDao.js';
import { makeVehiculosUseCases } from '../usecases/vehiculosUseCases.js';
import { makeVehiculosController } from '../controllers/vehiculosController.js';
import { makeVehiculosRouter } from '../routes/vehiculosRoutes.js';
import { notFound } from '../middlewares/notFound.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { makeReparacionesMemoryDao } from '../dao/reparacionesMemoryDao.js';
import { makeReparacionesUseCases } from '../usecases/reparacionesUseCases.js';
import { makeReparacionesController } from '../controllers/reparacionesController.js';
import { makeReparacionesRouter } from '../routes/reparacionesRoutes.js';

const vehiculosDao = makeVehiculosMemoryDao();
const reparacionesDao = makeReparacionesMemoryDao();
const vehiculosUseCases = makeVehiculosUseCases({ vehiculosDao, reparacionesDao });
const vehiculosController = makeVehiculosController({ vehiculosUseCases });
const vehiculosRouter = makeVehiculosRouter({ vehiculosController });
const reparacionesUseCases = makeReparacionesUseCases({ reparacionesDao, vehiculosDao });
const reparacionesController = makeReparacionesController({ reparacionesUseCases });
const reparacionesRouter = makeReparacionesRouter({ reparacionesController });

export const app = express();

app.use(express.json());
app.use(router);
app.use('/api/vehiculos', vehiculosRouter);
app.use('/api/reparaciones', reparacionesRouter);
app.use(notFound);
app.use(errorHandler);
