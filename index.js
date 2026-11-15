import 'dotenv/config';
import { config } from './config/config.js';
import { app } from './container/container.js';

app.listen(config.port, () => {
  console.log(`API Taller iniciada en http://localhost:${config.port}`);
});
