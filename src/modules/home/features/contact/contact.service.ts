import type { ApiResponse } from "@/utils/api";
import { apiRequest } from "@/utils/api";
import { config } from "@/config/config";

export interface ContactMessage {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const CONTACT_API_URL = `${config.API_BASE_URL}/api/v1/contact`;

export const sendContactMessage = (payload: ContactMessage) =>
    apiRequest<ApiResponse<string>>(
        CONTACT_API_URL,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        },
        "No se pudo enviar el mensaje",
    );
