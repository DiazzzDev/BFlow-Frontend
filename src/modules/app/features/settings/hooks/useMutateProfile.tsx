import { useMutation } from "@tanstack/react-query"

import {
    patchProfileData,
    patchProfilePhoto,
    type UpdateProfileData,
} from "../settings.service";

export const usePatchProfilePhoto = () => {

    return useMutation({
        mutationFn: (formData: FormData) => patchProfilePhoto(formData),
    })
}

export const usePatchProfileData = () => {

    return useMutation({
        mutationFn: (body: UpdateProfileData) => patchProfileData(body),
    })
}
