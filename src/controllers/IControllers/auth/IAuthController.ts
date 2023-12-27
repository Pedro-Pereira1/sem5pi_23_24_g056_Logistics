export interface IAuthController {
    validateToken(token: string): boolean
}