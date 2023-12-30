import { Inject, Service } from "typedi";
import { IAcceptRejectTaskService } from "../IServices/task/IAcceptRejectTaskService";
import { Result } from "../../core/logic/Result";
import { AcceptRejectTaskDTO } from "../../dto/AcceptRejectTaskDTO";
import ITaskRepo from "../IRepos/ITaskRepo";
import config from "../../../config";
import { TaskState } from "../../domain/TaskState";

@Service()
export default class AcceptRejectTaskService implements IAcceptRejectTaskService {

    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo
    ) { }

    public async acceptOrRejectTask(dto: AcceptRejectTaskDTO): Promise<Result<boolean>> {
        const task = await this.taskRepo.findById(dto.taskID);
        if (task === null) return Result.fail<boolean>("Task not found");
        if (task.taskState === TaskState.Accepted || task.taskState === TaskState.Rejected) return Result.fail<boolean>("Task already accepted or rejected")
        dto.accept ? task.acceptTask() : task.rejectTask();
        this.taskRepo.save(task);
        return Result.ok<boolean>(true)
    }


}