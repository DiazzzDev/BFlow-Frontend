export const VERIFICATION_CODE_LENGTH = 6;
export const RESEND_COOLDOWN_SECONDS = 30;

export const sanitizeVerificationCode = (value: string) =>
    value.replace(/\D/g, "").slice(0, VERIFICATION_CODE_LENGTH);
