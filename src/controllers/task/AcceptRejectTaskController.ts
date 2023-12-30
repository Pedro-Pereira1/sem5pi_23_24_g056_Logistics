import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import { IAuthService } from "../../services/IServices/auth/IAuthService";
import IAcceptRejectTaskController from "../IControllers/task/IAcceptRejectTaskController";
import { IAcceptRejectTaskService } from "../../services/IServices/task/IAcceptRejectTaskService";
import { AcceptRejectTaskDTO } from "../../dto/AcceptRejectTaskDTO";


@Service()
export default class AcceptRejectTaskController implements IAcceptRejectTaskController {
    
    constructor(
        @Inject(config.services.auth.name) private authService: IAuthService,
        @Inject(config.services.acceptRejectTask.name) private taskService: IAcceptRejectTaskService
    ) 
    {}

    public async acceptRejectTask(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }

        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["TaskManager"])){
            return res.status(401).send("Unauthorized");
        }

        try {
            const dto = req.body as AcceptRejectTaskDTO
            const result = await this.taskService.acceptOrRejectTask(dto)
            if(result.isFailure) {
                return res.status(400).send(result.errorValue())
            }
            return res.status(200).send(result.getValue())
        }catch (e){
            return next(e);
        }
    }
}