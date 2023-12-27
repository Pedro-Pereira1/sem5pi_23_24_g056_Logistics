import { Service } from "typedi"
import { IAuthService } from "../IServices/auth/IAuthService"
import config from "../../../config"
import jwt from 'jsonwebtoken'

@Service()
export default class AuthService implements IAuthService {

    constructor() {}

    public validateToken(token: string): boolean {
        if (token) {
            jwt.verify(token, config.tokenKey, (err, decoded) => {
                if (err) {
                    return false
                }
                return true
            })
        }
        return false
    }


    public validatePermission(userRole: string, permission: string[]): boolean {
        if (permission.includes(userRole)) {
            return true
        }
        return false
    }
    
}