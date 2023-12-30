import { Inject, Service } from "typedi";
import  config  from "../../../config";
import ITaskRepo from "../IRepos/ITaskRepo";
import { IAcceptRejectTaskService } from "../IServices/task/IAcceptRejectTaskService";
import { Result } from "../../core/logic/Result";
import { AcceptRejectTaskDTO } from "../../dto/AcceptRejectTaskDTO";

@Service()
export class AcceptRejectTaskService implements IAcceptRejectTaskService {

    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo,
    ) { }
    
    public async acceptOrRejectTask(dto: AcceptRejectTaskDTO): Promise<Result<boolean>> {
        const task = await this.taskRepo.findById(dto.taskID)
        if (task === null) {
            return Result.fail<boolean>("Task not found")
        }
        dto.accept ? task.acceptTask() : task.rejectTask()
        await this.taskRepo.save(task)
        return Result.ok<boolean>(true)
    }

}