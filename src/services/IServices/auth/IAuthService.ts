export interface IAuthService {
    validateToken(token: string): boolean
    validatePermission(userRole: string, permission: string[]): boolean
}