/**
 * Maps AWS Cognito Auth errors to translated, user-friendly messages while
 * keeping the original error available in the console for diagnostics.
 */
import type { TFunction } from "i18next";

export const getCognitoErrorMessage = (
    error: unknown,
    t: TFunction,
    fallbackKey = "auth.errors.unexpected"
): string => {
    console.error("[Cognito Auth Error Detail]:", error);

    if (typeof error !== "object" || error === null) {
        return typeof error === "string" ? error : t(fallbackKey);
    }

    const errObj = error as { name?: string; code?: string; message?: string };
    const name = errObj.name || errObj.code || "";
    const message = errObj.message || "";

    switch (name) {
        case "UsernameExistsException":
            return t("auth.errors.emailAlreadyRegistered");
        case "InvalidPasswordException":
            return t("auth.errors.passwordPolicy");
        case "InvalidParameterException":
            if (/password/i.test(message)) {
                return t("auth.errors.passwordPolicy");
            }
            if (/email/i.test(message)) {
                return t("auth.errors.invalidEmail");
            }
            return t("auth.errors.invalidData");
        case "CodeMismatchException":
            return t("auth.errors.invalidVerificationCode");
        case "ExpiredCodeException":
            return t("auth.errors.expiredVerificationCode");
        case "LimitExceededException":
        case "TooManyRequestsException":
            return t("auth.errors.tooManyAttempts");
        case "UserNotFoundException":
            return t("auth.errors.userNotFound");
        case "UserNotConfirmedException":
            return t("auth.errors.userNotConfirmed");
        case "NotAuthorizedException":
            return t("auth.errors.invalidCredentials");
        case "CodeDeliveryFailureException":
            return t("auth.errors.codeDeliveryFailed");
        default:
            if (message.includes("Password does not conform")) {
                return t("auth.errors.passwordPolicy");
            }
            if (message.includes("User is not confirmed")) {
                return t("auth.errors.userNotConfirmed");
            }
            return message || t(fallbackKey);
    }
};
