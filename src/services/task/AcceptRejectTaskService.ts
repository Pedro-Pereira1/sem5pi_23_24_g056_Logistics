import { Inject, Service } from "typedi";
import  config  from "../../../config";
import ITaskRepo from "../IRepos/ITaskRepo";
import { IAcceptRejectTaskService } from "../IServices/task/IAcceptRejectTaskService";
import { Result } from "../../core/logic/Result";

@Service()
export class AcceptRejectTaskService implements IAcceptRejectTaskService {

    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo,
    ) { }
    
    public async acceptOrRejectTask(taskID: string, accept: boolean): Promise<Result<boolean>> {
        const task = await this.taskRepo.findById(taskID)
        if (task === null) {
            return Result.fail<boolean>("Task not found")
        }
        accept ? task.acceptTask() : task.rejectTask()
        await this.taskRepo.save(task)
        return Result.ok<boolean>(true)
    }

}