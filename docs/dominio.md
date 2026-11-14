# Sistema de Gestión de Taller Mecánico

## Descripción del sistema

El sistema permite registrar, consultar, actualizar y eliminar vehículos y reparaciones. Ayuda a organizar los problemas de cada vehículo, el trabajo realizado y su estado.
No incluye clientes, mecánicos, repuestos, presupuestos, facturación ni autenticación.

## Entidades y atributos

**Vehículo**

- `id`: entero positivo, generado automáticamente y no modificable.
- `patente`: texto obligatorio y único.
- `marca` y `modelo`: textos obligatorios, de hasta 50 caracteres cada uno.
- `anio`: entero entre 1900 y el año actual + 1, inclusive.

**Reparación**

- `id`: entero positivo, generado automáticamente y no modificable.
- `vehiculoId`: identificador obligatorio de un vehículo existente; no puede cambiarse.
- `descripcionProblema`: texto obligatorio de hasta 500 caracteres.
- `trabajoRealizado`: texto de hasta 500 caracteres, inicialmente vacío.
- `estado`: `pendiente`, `en_proceso` o `finalizada`; comienza en `pendiente`.
- `fechaIngreso`: generada automáticamente, no modificable y expresada en ISO 8601 UTC.

## Relación y reglas de negocio

Un vehículo puede tener cero o muchas reparaciones y cada reparación pertenece a un único vehículo: relación **1:N** mediante `vehiculoId`.

- se quitan espacios exteriores de los textos y los obligatorios no pueden quedar vacíos. Las longitudes se verifican después de normalizar. La patente también pasa a mayúsculas, conserva espacios interiores y debe ser única al crear o actualizar, sin exigir un formato nacional.
- para registrar una reparación solo se reciben `vehiculoId` y `descripcionProblema`; el sistema completa los demás atributos.
- solo se avanza `pendiente → en_proceso → finalizada`, sin saltos ni retrocesos. Repetir el estado de una reparación editable se acepta sin transición ni evento, respetando las demás reglas.
- primero se inicia la reparación y en una actualización posterior se registra trabajo. En proceso puede modificarse o vaciarse; para finalizar debe contener texto válido. Si ya estaba en proceso, se permite registrar trabajo y finalizar en la misma actualización.
- la descripción puede editarse en pendiente o en proceso. Una reparación finalizada no puede modificarse, aunque se envíen los mismos valores.
- un vehículo con reparaciones no puede eliminarse. Una reparación puede eliminarse en cualquier estado, incluso finalizada, sin eliminar su vehículo.

Las actualizaciones son parciales mediante PATCH. Se rechazan peticiones vacías, campos desconocidos o inmutables y altas con datos generados por el sistema. Ningún rechazo modifica datos. Se valida primero la entrada, después la existencia y por último las reglas de negocio.

## Evento de finalización

`reparacion.finalizada` se emite únicamente después de guardar un cambio efectivo a finalizada y genera una notificación por consola. Si falla el guardado, no se emite; si falla la notificación, la reparación permanece finalizada y la operación no falla. Repetir la finalización no genera otra notificación.
