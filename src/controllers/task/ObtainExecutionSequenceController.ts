import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import { IAuthService } from "../../services/IServices/auth/IAuthService";
import IAcceptRejectTaskController from "../IControllers/task/IAcceptRejectTaskController";
import IObtainExecutionSequenceController from "../IControllers/task/IObtainExecutionSequenceController";


@Service()
export default class ObtainExecutionSequence implements IObtainExecutionSequenceController {
    
    constructor(
        @Inject(config.services.auth.name) private authService: IAuthService
    ) 
    {}

    public async obtainExecutionSequence(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }

        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["TaskManager"])){
            return res.status(401).send("Unauthorized");
        }

        try {
            //const buildingOrError = await this.service.createBuilding(req.body as IBuildingDTO) as Result<IBuildingDTO>
        //
            //if (buildingOrError.isFailure) {
            //    return res.status(400).send(buildingOrError.errorValue())
            //}
            //
            //const buildingDTO = buildingOrError.getValue();
            //return res.status(201).json(buildingDTO);

        }catch (e){
            return next(e);
        }
    }
}