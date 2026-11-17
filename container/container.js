import express from 'express';
import { EventEmitter } from 'node:events';
import { makeConsoleNotifier } from '../notifiers/consoleNotifier.js';
import { registerReparacionFinalizadaListener } from '../listeners/reparacionFinalizadaListener.js';
import { router } from '../routes/index.js';
import { config } from '../config/config.js';
import { setupSwagger } from '../config/swagger.js';
import { makeDaos } from '../dao/daoFactory.js';
import { makeVehiculosUseCases } from '../usecases/vehiculosUseCases.js';
import { makeVehiculosController } from '../controllers/vehiculosController.js';
import { makeVehiculosRouter } from '../routes/vehiculosRoutes.js';
import { notFound } from '../middlewares/notFound.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { makeReparacionesUseCases } from '../usecases/reparacionesUseCases.js';
import { makeReparacionesController } from '../controllers/reparacionesController.js';
import { makeReparacionesRouter } from '../routes/reparacionesRoutes.js';

// Esperamos la persistencia antes de preparar la aplicación y abrir el servidor.
const { vehiculosDao, reparacionesDao, close } = await makeDaos(config);
export const closePersistence = close;
// El mismo bus conecta al emisor con el listener, sin unir sus responsabilidades.
const eventBus = new EventEmitter();
const notifier = makeConsoleNotifier();
registerReparacionFinalizadaListener({ eventBus, notifier });
// Las dependencias se crean aquí y se entregan a cada capa por parámetro.
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
await setupSwagger(app);
// Estos middlewares van al final: atienden rutas sin coincidencia y errores.
app.use(notFound);
app.use(errorHandler);
