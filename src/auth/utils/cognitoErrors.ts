/**
 * Translates AWS Cognito Auth errors into user-friendly Spanish messages
 * and logs diagnostic info to the console.
 */
export const getCognitoErrorMessage = (
    error: unknown,
    fallbackMessage = "Ocurrió un error inesperado"
): string => {
    console.error("[Cognito Auth Error Detail]:", error);

    if (typeof error !== "object" || error === null) {
        return typeof error === "string" ? error : fallbackMessage;
    }

    const errObj = error as { name?: string; code?: string; message?: string };
    const name = errObj.name || errObj.code || "";
    const message = errObj.message || "";

    switch (name) {
        case "UsernameExistsException":
            return "Este correo electrónico ya está registrado. Por favor inicia sesión.";
        case "InvalidPasswordException":
            return "La contraseña debe contener al menos 8 caracteres, números, letras mayúsculas y minúsculas o símbolos.";
        case "InvalidParameterException":
            if (/password/i.test(message)) {
                return "La contraseña no cumple con las políticas de seguridad de Cognito.";
            }
            if (/email/i.test(message)) {
                return "El formato del correo electrónico no es válido.";
            }
            return "Los datos ingresados no coinciden con los requeridos.";
        case "CodeMismatchException":
            return "El código de verificación ingresado es incorrecto.";
        case "ExpiredCodeException":
            return "El código ha expirado. Haz clic en 'Reenviar código' para obtener uno nuevo.";
        case "LimitExceededException":
        case "TooManyRequestsException":
            return "Demasiados intentos. Por favor espera unos minutos antes de reintentar.";
        case "UserNotFoundException":
            return "No existe ninguna cuenta asociada a este correo electrónico.";
        case "UserNotConfirmedException":
            return "Tu cuenta aún no está verificada.";
        case "NotAuthorizedException":
            return "Correo o contraseña incorrectos.";
        case "CodeDeliveryFailureException":
            return "Error al entregar el correo. Asegúrate de ingresar una dirección válida.";
        default:
            if (message.includes("Password does not conform")) {
                return "La contraseña debe cumplir la política de seguridad (mínimo 8 caracteres).";
            }
            if (message.includes("User is not confirmed")) {
                return "Tu cuenta aún no está verificada.";
            }
            return message || fallbackMessage;
    }
};
