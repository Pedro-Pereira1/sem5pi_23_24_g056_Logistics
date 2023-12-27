export interface ITokenValidatorService {
    validateToken(token: string): boolean
}