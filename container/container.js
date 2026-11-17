import express from 'express';
import { EventEmitter } from 'node:events';
import { makeConsoleNotifier } from '../notifiers/consoleNotifier.js';
import { registerReparacionFinalizadaListener } from '../listeners/reparacionFinalizadaListener.js';
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
const eventBus = new EventEmitter();
const notifier = makeConsoleNotifier();
registerReparacionFinalizadaListener({ eventBus, notifier });
const vehiculosUseCases = makeVehiculosUseCases({ vehiculosDao, reparacionesDao });
const vehiculosController = makeVehiculosController({ vehiculosUseCases });
const vehiculosRouter = makeVehiculosRouter({ vehiculosController });
const reparacionesUseCases = makeReparacionesUseCases({ reparacionesDao, vehiculosDao, eventBus });
const reparacionesController = makeReparacionesController({ reparacionesUseCases });
const reparacionesRouter = makeReparacionesRouter({ reparacionesController });

export const app = express();

app.use(express.json());
app.use(router);
app.use('/api/vehiculos', vehiculosRouter);
app.use('/api/reparaciones', reparacionesRouter);
app.use(notFound);
app.use(errorHandler);
