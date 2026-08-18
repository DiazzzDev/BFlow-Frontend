import type { CreateTransferData, Transfer } from "../interfaces/Transfer";

import { config } from "@/config/config";
import { idempotentPost } from "@/utils/idempotentPost";

const transfersUrl = `${config.API_BASE_URL}/api/v1/tranfers`;

export const postTransfer = async (transferData: CreateTransferData) => {
    return await idempotentPost<Transfer>(transfersUrl, transferData, {
        friendlyMessage: "Error al crear la transferencia",
    });
};
