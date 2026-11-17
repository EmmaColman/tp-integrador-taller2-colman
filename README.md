# Sistema de Gestión de Taller Mecánico

API REST con Node.js, Express y arquitectura en capas para registrar vehículos y administrar sus reparaciones.

El sistema trabaja con dos entidades: **Vehículo** y **Reparación**. Un vehículo puede tener cero o muchas reparaciones y cada reparación pertenece a un único vehículo mediante `vehiculoId` (relación 1:N).

## Instalación y configuración

Se necesitan Node.js y npm. El proyecto fue probado con Node.js **22.11.0**; esa versión cumple los requisitos de las dependencias actuales. SQLite funciona mediante un archivo local, sin instalar un servidor de base de datos aparte.

Desde la raíz del proyecto, instalá las dependencias:

```bash
npm install
```

Copiá `.env.example` como `.env`. En PowerShell:

```powershell
Copy-Item .env.example .env
```

El archivo contiene:

```env
PORT=3000
PERSISTENCE_TYPE=memory
SQLITE_STORAGE=./data/taller.sqlite
```

`PORT` define el puerto, `PERSISTENCE_TYPE` selecciona la persistencia y `SQLITE_STORAGE` indica dónde guardar la base SQLite. La ruta relativa se interpreta desde el directorio donde se ejecuta el proyecto. `.env` y los archivos de base de datos no se versionan.

## Ejecución y persistencia

```bash
npm start
```

Con la configuración de ejemplo, el servidor inicia en `http://localhost:3000`. La ruta `/` devuelve un mensaje para comprobar que funciona. Para detenerlo, presioná `Ctrl+C`.

- **Memoria:** usá `PERSISTENCE_TYPE=memory`. Los datos se guardan en arrays y se pierden al reiniciar.
- **SQLite:** usá `PERSISTENCE_TYPE=sqlite`. El directorio, el archivo y las tablas se preparan automáticamente antes de iniciar el servidor. Los datos se conservan al reiniciar, sin borrar las tablas.

Reiniciá el servidor después de cambiar `.env`. Cambiar de modo no copia los datos entre memoria y SQLite. Si no existe `.env`, se usan los valores predeterminados del ejemplo.

## Documentación de la API

Abrí **http://localhost:3000/api-docs** para consultar los endpoints, ejemplos y respuestas, y probarlos con **Try it out**. Si cambiás el puerto, ajustá la dirección. Swagger utiliza la persistencia seleccionada al iniciar el servidor.

## Evento de finalización

Cuando se guarda una transición efectiva de una reparación a `finalizada`, se emite `reparacion.finalizada`. Un listener independiente utiliza un notificador por consola. Si la notificación falla, la reparación sigue finalizada y la operación no falla. Repetir una finalización no genera otra notificación.

