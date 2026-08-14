export interface UserProfile {
    id: string;
    email: string;
    name: string;
    pictureUrl: string | null;
    roles: string[];
    status: string;
}

export interface InternalUser {
    id: string;
    email: string;
    roles: string[];
    isNewUser: boolean;
    name: string | null;
    pictureUrl: string | null;
}
