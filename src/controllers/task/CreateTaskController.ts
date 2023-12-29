import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import { IAuthService } from "../../services/IServices/auth/IAuthService";
import ICreateTaskController from "../IControllers/task/ICreateTaskController";


@Service()
export default class CreateTaskController implements ICreateTaskController {
    
    constructor(
        @Inject(config.services.auth.name) private authService: IAuthService
    ) 
    {}

    public async createTask(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["Utente"])){
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