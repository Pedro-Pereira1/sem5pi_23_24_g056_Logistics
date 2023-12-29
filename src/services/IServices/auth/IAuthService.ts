import { Request } from "express"

export interface IAuthService {
    validateToken(req: Request): boolean
    validatePermission(userRole: string, permission: string[]): boolean
}