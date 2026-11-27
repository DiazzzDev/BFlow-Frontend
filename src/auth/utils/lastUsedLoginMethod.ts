export type LoginMethod = "Google" | "email";

const PENDING_KEY = "bflow.auth.pending-login-method";
const LAST_USED_KEY = "bflow.auth.last-used-login-method";

export const markPendingLoginMethod = (method: LoginMethod) =>
    sessionStorage.setItem(PENDING_KEY, method);

export const confirmPendingLoginMethod = () => {
    const method = sessionStorage.getItem(PENDING_KEY) as LoginMethod | null;
    sessionStorage.removeItem(PENDING_KEY);
    if (method) {localStorage.setItem(LAST_USED_KEY, method);}
};

export const recordEmailLogin = () => localStorage.setItem(LAST_USED_KEY, "email");

export const getLastUsedLoginMethod = (): LoginMethod | null => {
    const method = localStorage.getItem(LAST_USED_KEY);
    return method === "Google" || method === "email" ? method : null;
};
