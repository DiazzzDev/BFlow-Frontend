const WINDOW_MS = 60 * 60 * 1000;
const MAX_ATTEMPTS: Record<EmailAction, number> = {
    "password-reset": 3,
    signup: 2,
    "verification-resend": 3,
};

export type EmailAction = "password-reset" | "signup" | "verification-resend";

type RateLimitEntry = { attempts: number[] };

const keyFor = (action: EmailAction, email: string) =>
    `bflow.auth.rate-limit.${action}.${email.trim().toLowerCase()}`;

export class EmailActionRateLimitError extends Error {
    constructor() {
        super("Too many requests. Please try again later.");
        this.name = "EmailActionRateLimitError";
    }
}

export const assertEmailActionAllowed = (action: EmailAction, email: string, now = Date.now()) => {
    const key = keyFor(action, email);
    const raw = localStorage.getItem(key);
    const previous = raw ? JSON.parse(raw) as RateLimitEntry : { attempts: [] };
    const attempts = previous.attempts.filter((attempt) => now - attempt < WINDOW_MS);

    if (attempts.length >= MAX_ATTEMPTS[action]) {
        throw new EmailActionRateLimitError();
    }

    localStorage.setItem(key, JSON.stringify({ attempts: [...attempts, now] }));
};
