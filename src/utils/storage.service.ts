// services/storage.service.ts
import { apiRequest } from "@/utils/api";
import { config } from "@/config/config";

const storageUrl = `${config.API_BASE_URL}/api/v1/files`;

export interface PresignedUploadRequest {
    originalFilename: string;
    contentType: string;
    sizeBytes: number;
}

// 1. Pedir Presigned URL
export const getPresignedUploadUrl = async (payload: PresignedUploadRequest) => {
    return await apiRequest(
        `${storageUrl}/presigned-upload`,
        {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
        },
        "Error al solicitar URL de subida"
    );
};

// 2. Subir directamente a S3 (PUT)
export const uploadFileToS3 = async (uploadUrl: string, file: File, requiredHeaders?: Record<string, string>) => {
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

// 3. Confirmar subida completa en Backend
export const completeFileUpload = async (fileId: string) => {
    return await apiRequest(
        `${storageUrl}/${fileId}/complete`,
        { method: "POST" },
        "Error al confirmar la subida del archivo"
    );
};