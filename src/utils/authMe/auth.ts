export interface UserInfo {
    userId: string,
    email: string,
    roles: string[]
}

export interface AuthMeResponse {
    success: true,
    message: string,
    data: UserInfo,
    timestamp: string,
    path: string
}
