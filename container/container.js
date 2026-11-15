import express from 'express';
import { router } from '../routes/index.js';
import { makeVehiculosMemoryDao } from '../dao/vehiculosMemoryDao.js';
import { makeVehiculosUseCases } from '../usecases/vehiculosUseCases.js';
import { makeVehiculosController } from '../controllers/vehiculosController.js';
import { makeVehiculosRouter } from '../routes/vehiculosRoutes.js';
import { notFound } from '../middlewares/notFound.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const vehiculosDao = makeVehiculosMemoryDao();
const vehiculosUseCases = makeVehiculosUseCases({ vehiculosDao });
const vehiculosController = makeVehiculosController({ vehiculosUseCases });
const vehiculosRouter = makeVehiculosRouter({ vehiculosController });

export const app = express();

app.use(express.json());
app.use(router);
app.use('/api/vehiculos', vehiculosRouter);
app.use(notFound);
app.use(errorHandler);
