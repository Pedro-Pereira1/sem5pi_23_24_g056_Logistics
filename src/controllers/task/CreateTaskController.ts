import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import { IAuthService } from "../../services/IServices/auth/IAuthService";
import ICreateTaskController from "../IControllers/task/ICreateTaskController";
import ICreateTaskService from "../../services/IServices/task/ICreateTaskService";
import ITaskDTO from "../../dto/CreateTaskDTO";
import ICreateTaskDTO from "../../dto/CreateTaskDTO";


@Service()
export default class CreateTaskController implements ICreateTaskController {
    
    constructor(
        @Inject(config.services.auth.name) private authService: IAuthService,
        @Inject(config.services.task.name) private service: ICreateTaskService
    ) 
    {}

    public async createTask(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["Utente"])){
            return res.status(401).send("Unauthorized");
        }

        try {
            const taskOrError = await this.service.createTask(req.body as ICreateTaskDTO) as Result<ITaskDTO>
        
            if (taskOrError.isFailure) {
                return res.status(400).send(taskOrError.errorValue())
            }
            
            const taskDTO = taskOrError.getValue();
            return res.status(201).json(taskDTO);

        }catch (e){
            return next(e);
        }
    }
}