import { useMutation } from "@tanstack/react-query"

import { patchProfileData, patchProfilePhoto } from "../settings.service";

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