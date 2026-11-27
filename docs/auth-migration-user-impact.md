# Autenticación Cognito: impacto verificable

## Alcance y fuente de verdad

La rama parte exactamente de `main` en `b55eea9ef5d95d16a1fa78c0c7dd78173a921686`. El frontend ya no importa ni inicializa `aws-amplify`: tokens, OAuth PKCE, refresh, contraseña y TOTP se ejecutan contra Cognito. El backend sigue validando el JWT Cognito en `/api/v1/auth/sync`.

| Acción del usuario | Antes | Después | Archivo origen |
| --- | --- | --- | --- |
| Correo y contraseña | Amplify gestionaba `signIn` y su almacén privado. | `InitiateAuth` de Cognito (`USER_PASSWORD_AUTH`) guarda el resultado de Cognito. | `src/auth/services/authService.ts` |
| Google | `signInWithRedirect` de Amplify y espera/polling posterior; podía surgir `Tokens not found`. | Authorization Code con PKCE, estado validado y canje explícito en `/oauth2/token`; no hay polling de Amplify. | `src/auth/cognito/oidc.ts`, `src/modules/auth/features/oauthCallback/oauthCallback.service.ts` |
| Refresh | Dependía de Amplify. | Se renueva por `refresh_token` antes de usar el access token; al fallar se elimina la sesión. | `src/auth/cognito/oidc.ts` |
| Recuperar contraseña | El navegador llamaba Amplify sin límite local. | Límite local por email/acción y `ForgotPassword`/`ConfirmForgotPassword` de Cognito. | `src/auth/utils/emailActionRateLimit.ts`, `src/auth/services/authService.ts` |
| Registro y reenvío | Amplify hacía `SignUp` y `ResendConfirmationCode`. | Cognito directo, con presupuesto local más estricto para el primer envío. | `src/auth/services/authService.ts` |
| Cambio de contraseña | Se ofrecía aunque la sesión fuese Google. | Se oculta para ID token federado y `ChangePassword` rechaza defensivamente ese caso. | `src/auth/cognito/oidc.ts`, `src/auth/services/authService.ts`, `src/modules/app/features/settings/components/sections/SettingsAccountSection.tsx` |
| MFA TOTP | API de Amplify. | `AssociateSoftwareToken`, `VerifySoftwareToken` y `SetUserMFAPreference` de Cognito. | `src/auth/cognito/mfa.ts`, `src/modules/app/features/settings/hooks/useMfaSetup.ts` |
| “Last used” | No había garantía de que reflejara un acceso terminado. | Google se marca sólo cuando terminó el callback PKCE; correo sólo tras sincronizar sesión. | `src/auth/utils/lastUsedLoginMethod.ts` |

## Controles y límites de seguridad

- Los límites del navegador (3 recuperaciones, 3 reenvíos y 2 registros por hora por email) evitan clics repetidos y tienen pruebas. No bloquean scripts que llamen Cognito sin pasar por la UI.
- Para impedir gasto por registros/correos falsos en producción se requiere CAPTCHA o Cognito threat protection para alta y rate limit/WAF para cualquier endpoint propio que inicie mensajes. Cognito debe usar SES con identidad `noreply` verificada.
- El login base solicita sólo `openid email profile`, que son los scopes actualmente permitidos por el app client. MFA de autoservicio se activa únicamente con `VITE_COGNITO_SELF_SERVICE_MFA_ENABLED=true`. Antes de activar esa bandera, Terraform debe permitir `aws.cognito.signin.user.admin` en el cliente SPA sin secreto; de otro modo Cognito responde `invalid_scope` durante el login. El cliente debe permitir `USER_PASSWORD_AUTH`, Authorization Code + PKCE, refresh, Google/SSO, callback/salida y MFA TOTP.

## Hallazgo del monolito

`auth_account.provider` existe, pero `AuthSyncService` no lo consulta ni lo devuelve. `/api/v1/auth/sync` vincula por `cognitoSub` y, para cuentas previas, por email. El frontend decide ocultar cambio de contraseña a partir del claim `identities` firmado por Cognito, no de esa tabla. Una migración de filas `LOCAL`/`GOOGLE` debe tener prueba de contrato del backend antes de activarse.

## Matriz de pruebas añadida

| Caso crítico | Prueba |
| --- | --- |
| Cuarto envío de recuperación no llega a Cognito | `tests/unit/auth/services/authService.test.ts` |
| Usuario federado no puede cambiar contraseña | `tests/unit/auth/services/authService.test.ts` |
| Usuario local usa `ChangePassword` con access token | `tests/unit/auth/services/authService.test.ts` |
| TOTP asocia, verifica y habilita MFA en ese orden | `tests/unit/auth/cognito/mfa.test.ts` |
| No marcar Google como usado antes de callback | `tests/unit/auth/utils/lastUsedLoginMethod.test.ts` |
| Ventanas de registro/reenvío/recuperación | `tests/unit/auth/utils/emailActionRateLimit.test.ts` |
