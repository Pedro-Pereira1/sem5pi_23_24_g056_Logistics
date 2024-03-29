import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import IListTaskController from "../IControllers/task/IListTaskController";
import { IAuthService } from "../../services/IServices/auth/IAuthService";
import IListPendingTaskService from "../../services/IServices/task/IListPendingTaskService";
import ITaskDTO from "../../dto/TaskDTO";
import ISearchTaskService from "../../services/IServices/task/ISearchTaskService";


@Service()
export default class ListTaskController implements IListTaskController {

    constructor(
        @Inject(config.services.auth.name) private authService: IAuthService,
        @Inject(config.services.listAllTasks.name) private listAllTaskService,
        @Inject(config.services.listTask.name) private taskService: IListPendingTaskService,
        @Inject(config.services.searchTask.name) private searchTaskService: ISearchTaskService,
    )
    {}

    public async searchTask(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }

        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["TaskManager"])){
            return res.status(401).send("Unauthorized");
        }

        try {
            const { robotTypeID, taskState, user, initialDate, finalDate } = req.params;
            //console.log(robotTypeID, taskState, user, initialDate, finalDate)
            const taskOrError = await this.searchTaskService.searchTask(robotTypeID, taskState, user, initialDate, finalDate)
            if (taskOrError.isFailure) {
                return res.status(400).send(taskOrError.error)
            }
            
            const taskDTO = taskOrError.getValue();
            return res.status(200).json(taskDTO);
        }catch (e){
            return next(e);
        }
    }


    public async listPendingTasks(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }

        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["TaskManager"])){
            return res.status(401).send("Unauthorized");
        }

        try {
            const taskOrError = await this.taskService.listPendingTasks()

            if (taskOrError.isFailure) {
                return res.status(400).send()
            }

            const taskDTO = taskOrError.getValue();
            return res.status(200).json(taskDTO);

        }catch (e){
            return next(e);
        }
    }

    public async listAllTasks(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }

        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["TaskManager"])){
            return res.status(401).send("Unauthorized");
        }

        try {
            const tasks = await this.listAllTaskService.listAllTasks()

            if(tasks.isFailure) {
                return res.status(400).send()
            }

            return res.status(200).json(tasks.getValue())
        }catch (e){
          throw e;
        }
    }

    public async listAcceptedTasks(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }

        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["TaskManager"])){
            return res.status(401).send("Unauthorized");
        }
        
        try {
            const tasks = await this.listAllTaskService.listAcceptedTasks()

            if(tasks.isFailure) {
                return res.status(400).send()
            }

            return res.status(200).json(tasks.getValue())
        }catch (e){
            throw e;
        }
    }
}
