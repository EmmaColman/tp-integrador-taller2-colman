import { readFile } from 'node:fs/promises';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';

export async function setupSwagger(app) {
  const file = await readFile(new URL('../docs/openapi.yaml', import.meta.url), 'utf8');
  const document = YAML.parse(file);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document, {
    swaggerOptions: { validatorUrl: null },
  }));
}
