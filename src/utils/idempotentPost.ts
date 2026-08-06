import { apiRequest, APIError } from "@/utils/api";

type IdempotentPostOptions = {
    maxRetries?: number;
    friendlyMessage?: string;
};

const isRetryableError = (error: unknown) => {
    if (!(error instanceof APIError)) { return true };
    if (error.status === 409) { return false };
    if (error.status === 0) { return true };
    if (error.status >= 500) { return true };
    return false;
};

export const idempotentPost = async <T>(
    url: string,
    body: unknown,
    options: IdempotentPostOptions = {},
): Promise<T> => {
    const { maxRetries = 2, friendlyMessage = "Error de API" } = options;
    const idempotencyKey = crypto.randomUUID();

    let attempt = 0;
    let lastError: unknown;

    while (attempt <= maxRetries) {
        try {
            return await apiRequest<T>(
                url,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Idempotency-Key": idempotencyKey,
                    },
                    body: JSON.stringify(body),
                },
                friendlyMessage,
            );
        } catch (error) {
            if (error instanceof APIError && error.status === 409) {
                throw new APIError(
                    "Esta operación ya fue procesada con un payload diferente. Vuelve a intentarlo.",
                    409,
                    error,
                    url,
                );
            }

            if (!isRetryableError(error) || attempt === maxRetries) {
                throw error;
            }

            lastError = error;
            attempt += 1;
        }
    }

    throw lastError;
};
