import { useMutation } from "@tanstack/react-query"

import { patchProfileData, patchProfilePhoto } from "../settings.service";
//import { completeFileUpload, getPresignedUploadUrl, uploadFileToS3 } from "@/utils/api";

export const usePatchProfilePhoto = () => {

    return useMutation({
        mutationFn: (formData: FormData) => patchProfilePhoto(formData),
    })
}

export const usePatchProfileData = () => {

    return useMutation({
        mutationFn: (body: { email: string; name: string }) => patchProfileData(body),
    })
}

/*export const useUploadProfilePhoto = () => {

    return useMutation({
        mutationFn: async (file: File) => {
            // FETCH 1: Pedir presigned URL
            const presignedRes = await getPresignedUploadUrl({
                originalFilename: file.name,
                contentType: file.type,
                sizeBytes: file.size,
            });

            const { fileId, uploadUrl, requiredHeaders } = presignedRes.data;

            // FETCH 2: Subir a S3 directamente
            await uploadFileToS3(uploadUrl, file, requiredHeaders);

            // FETCH 3: Confirmar subida y actualizar foto en perfil
            await completeFileUpload(fileId);
            return await updateProfilePicture(fileId);
        }
    });
};*/