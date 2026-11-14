# Dominio: Sistema de Gestión de Taller Mecánico

## 1. Descripción y alcance del sistema

El sistema permite registrar vehículos y administrar sus reparaciones mediante una API REST. Organiza los problemas informados, el trabajo realizado y el estado de cada reparación.

Incluye crear, listar, consultar por identificador, actualizar parcialmente y eliminar vehículos y reparaciones, respetando las reglas del dominio.
Quedan excluidos clientes, mecánicos, repuestos, presupuestos, facturación y autenticación.

La consigna exige dos entidades con CRUD completo, una relación 1:N como mínimo, reglas de negocio y un evento desacoplado. El taller, sus atributos y las reglas siguientes son decisiones propias del proyecto.

## 2. Entidades y atributos

### Vehículo

| Atributo | Condiciones |
|---|---|
| `id` | Entero positivo, autogenerado e inmutable. |
| `patente` | Texto obligatorio, único y normalizado, sin formato nacional obligatorio. |
| `marca` | Texto obligatorio, máximo 50 caracteres. |
| `modelo` | Texto obligatorio, máximo 50 caracteres. |
| `anio` | Entero entre 1900 y el año actual + 1, inclusive. |

### Reparación

| Atributo | Condiciones |
|---|---|
| `id` | Entero positivo, autogenerado e inmutable. |
| `vehiculoId` | Identificador obligatorio de un vehículo existente; inmutable. |
| `descripcionProblema` | Texto obligatorio, máximo 500 caracteres. |
| `trabajoRealizado` | Texto de máximo 500 caracteres; inicialmente vacío. |
| `estado` | `pendiente`, `en_proceso` o `finalizada`; inicialmente `pendiente`. |
| `fechaIngreso` | Autogenerada e inmutable; representada en ISO 8601 UTC. |

## 3. Relación entre Vehículo y Reparación

Un vehículo puede tener cero o muchas reparaciones. Cada reparación pertenece a un único vehículo existente, identificado mediante `vehiculoId`.

**Vehículo (1) → Reparación (0..N)**

El vínculo no puede cambiarse después de registrar la reparación.

## 4. Reglas de negocio principales

Los identificadores RN corresponden a reglas del dominio, no a requisitos no funcionales. Se agrupan las reglas relacionadas conservando sus referencias.

- **RN-01, RN-02 y RN-11 — Datos válidos:** se eliminan espacios exteriores de todos los textos y se rechazan los obligatorios vacíos. Los límites de longitud de las tablas se aplican al texto normalizado. El año debe cumplir el rango indicado al validar la operación.
- **RN-01 — Patentes:** también se convierten a mayúsculas, conservando espacios interiores. Su valor normalizado debe ser único tanto al crear como al actualizar; no puede pertenecer a otro vehículo.
- **RN-03 y RN-06 — Alta e identidad:** una reparación se crea únicamente con `vehiculoId` y `descripcionProblema`, para un vehículo existente. El sistema genera ID, fecha, estado pendiente y trabajo vacío. Los ID de ambas entidades, `vehiculoId` y `fechaIngreso` son inmutables.
- **RN-04 y RN-05 — Eliminación:** no se elimina un vehículo con reparaciones asociadas, cualquiera sea su estado. Se permite eliminar reparaciones incluso finalizadas, sin eliminar su vehículo.
- **RN-07 — Estados:** solo se permite avanzar `pendiente → en_proceso → finalizada`, sin saltos ni retrocesos. Repetir el estado de una reparación editable se acepta sin transición efectiva ni evento, respetando las demás reglas.
- **RN-08 — Registro de trabajo:** la reparación debe estar previamente en proceso. Primero se inicia y, en una actualización posterior, se registra trabajo. Mientras siga en proceso, puede modificarse o vaciarse el trabajo realizado.
- **RN-09 — Finalización:** requiere trabajo válido y no vacío después de normalizar. Si ya está en proceso, se permite registrar trabajo y finalizar en el mismo PATCH.
- **RN-10 y RN-12 — Edición:** la descripción del problema puede editarse en pendiente o en proceso. Una reparación finalizada no admite modificaciones, aunque se envíen los mismos valores; sí puede eliminarse.

### Actualizaciones y prioridad de errores

Las actualizaciones utilizan PATCH y son parciales. Se rechazan peticiones vacías, campos desconocidos o inmutables y altas con campos generados por el sistema. Una actualización rechazada no modifica ningún dato.

El orden de evaluación es obligatorio; solo se avanza si se supera la etapa anterior:

1. **Validación de entrada (400):** parámetros, estructura, campos permitidos, tipos y valores. Los identificadores deben ser enteros positivos.
2. **Existencia (404):** el recurso solicitado debe existir; también el vehículo al crear una reparación. Incluye eliminar una reparación inexistente.
3. **Reglas de negocio (409):** patente duplicada, eliminación de vehículo con reparaciones, transición inválida, cierre sin trabajo o modificación de reparación finalizada.

Por eso, un campo inmutable en un PATCH sobre una reparación finalizada produce 400; con entrada válida y recurso existente, intentar modificarla produce 409. El detalle de respuestas se documentará en requisitos y Swagger.

## 5. Evento de finalización

El evento **`reparacion.finalizada`** se emite después de guardar correctamente una transición efectiva de `en_proceso` a `finalizada`. Si el guardado falla, no se emite.

Se utiliza EventEmitter, un listener separado y un notificador por consola. Un fallo de notificación no invalida la finalización ni hace fallar la operación principal.

Una solicitud secuencial que repite la finalización se rechaza y no genera otro evento ni notificación. No se garantiza comportamiento exactamente una vez ante concurrencia, reinicios o fallos del proceso, ni entrega garantizada.
