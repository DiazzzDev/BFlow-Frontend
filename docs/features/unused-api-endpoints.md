# Endpoints del backend aún no consumidos por el frontend

Inventario contrastado el 13 de noviembre de 2026 contra el contrato publicado en `https://api.bflow-studio.com/v3/api-docs` y las llamadas presentes en `src/`. Se consideran **no utilizados** los endpoints que no tienen una llamada equivalente con el mismo método y ruta en el frontend; no implica que deban implementarse todos.

## Dashboard y analítica

- `GET /api/v1/dashboard/statistics`
- `GET /api/v1/dashboard/spending`
- `GET /api/v1/dashboard/activity-breakdown`

## Presupuestos

- `GET /api/v1/budgets/{id}/status`
- `GET /api/v1/budgets/wallet/{walletId}`
- `GET /api/v1/budgets/wallet/{walletId}/summary`

`GET /api/v1/budgets/{id}/detail` sí está integrado en la vista de presupuesto.

## Billeteras, miembros y transferencias

- `PUT /api/v1/wallets/{id}/opening-balance`
- `PUT /api/v1/wallets/{id}/default`
- `DELETE /api/v1/wallets/{walletId}/members/me`
- `GET /api/v1/tranfers/{id}`
- `GET /api/v1/tranfers/wallet/{walletId}`

La administración de colaboradores, invitaciones enviadas y transferencias de creación/listado general ya está integrada. El nombre `tranfers` (sin la segunda `s`) es el que expone el contrato actual.

## Transacciones recurrentes

- `GET /api/v1/recurring/{id}`
- `PUT /api/v1/recurring/{id}`
- `DELETE /api/v1/recurring/{id}`
- `GET /api/v1/recurring/wallet/{walletId}`
- `PATCH /api/v1/recurring/{id}/end-date`
- `PATCH /api/v1/recurring/{id}/deactivate`
- `PATCH /api/v1/recurring/{id}/activate`

## Recibos e importación

- `POST /api/v1/receipts`
- `DELETE /api/v1/receipts/{id}`
- `POST /api/v1/import/csv`

El flujo de carga, consulta y confirmación de recibos (`/receipts/upload`, `GET /receipts/{id}`, `/confirm`) ya se utiliza.

## Integraciones, archivos y dispositivos

- `POST /api/v1/integrations/gmail/sync`
- `GET /api/v1/integrations/gmail/status`
- `GET /api/v1/integrations/gmail/imports`
- `GET /api/v1/integrations/gmail/connect`
- `GET /api/v1/integrations/gmail/callback`
- `DELETE /api/v1/integrations/gmail`
- `POST /api/v1/notifications/devices`
- `DELETE /api/v1/notifications/devices`
- `POST /api/v1/files/{id}/complete`

## Cuenta, suscripción y otros

- `POST /api/v1/users/me/deletion/cancel`
- `GET /api/v1/users/me/export`
- `GET /api/v1/users/{userId}/picture`
- `GET /api/v1/subscriptions`
- `GET /api/v1/subscriptions/current`
- `POST /api/v1/webhooks/wompi`

El webhook normalmente lo consume Wompi y no el navegador; se conserva aquí como referencia del contrato, no como tarea sugerida para el frontend.
