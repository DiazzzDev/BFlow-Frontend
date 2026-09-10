import { config } from "@/config/config";

import { apiRequest } from "./api";

const storageUrl = `${config.API_BASE_URL}/api/v1/files`;

export interface PresignedUploadRequest {
    originalFilename: string;
    contentType: string;
    sizeBytes: number;
}

export const getPresignedUploadUrl = async (payload: PresignedUploadRequest) => {
    return await apiRequest(
        `${storageUrl}/presigned-upload`,
        {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        },
        "Error al solicitar URL de subida",
    );
};

export const uploadFileToS3 = async (
    uploadUrl: string,
    file: File,
    requiredHeaders?: Record<string, string>,
) => {
    const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Type": file.type,
            ...requiredHeaders,
        },
        body: file,
    });

    if (!response.ok) {
        throw new Error("Error al subir el archivo a S3");
    }
};

export const completeFileUpload = async (fileId: string) => {
    return await apiRequest(
        `${storageUrl}/${fileId}/complete`,
        { method: "POST" },
        "Error al confirmar la subida del archivo",
    );
};
