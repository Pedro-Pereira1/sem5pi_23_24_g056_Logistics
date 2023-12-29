import { Service } from "typedi"
import { IAuthService } from "../IServices/auth/IAuthService"
import config from "../../../config"
import jwt from 'jsonwebtoken'
import { Request } from "express"

@Service()
export default class AuthService implements IAuthService {

    constructor() {}

    public validateToken(req: Request): boolean {
        var auth = req.headers['authorization']
        if (!auth) {
            //return res.status(401)
            return false
        }
        var token = auth.split(' ')[1];
        var isValid: boolean = false
        if (token) {
            jwt.verify(token, "u2mUMiNxgfIbfXIOhOFskAI8o6doVRCH", (err, decoded) => {
                if (err) {
                    console.log("error")
                    //return res.status(500)
                    return false
                }
                // @ts-ignore
                req.userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
                // @ts-ignore
                req.userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                isValid = true
            })
        }
        return isValid
    }


    public validatePermission(userRole: string, permission: string[]): boolean {
        if (permission.includes(userRole)) {
            return true
        }
        return false
    }
    
}