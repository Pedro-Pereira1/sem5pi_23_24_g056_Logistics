import { Inject, Service } from "typedi";
import { IAcceptRejectTaskService } from "../IServices/task/IAcceptRejectTaskService";
import { Result } from "../../core/logic/Result";
import { AcceptRejectTaskDTO } from "../../dto/AcceptRejectTaskDTO";
import ITaskRepo from "../IRepos/ITaskRepo";
import config from "../../../config";

@Service()
export default class AcceptRejectTaskService implements IAcceptRejectTaskService {

    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo
    ) { }

    public async acceptOrRejectTask(dto: AcceptRejectTaskDTO): Promise<Result<boolean>> {
        const task = await this.taskRepo.findById(dto.taskID);
        if (task === null) return Result.fail<boolean>("Task not found");
        dto.accept ? task.acceptTask() : task.rejectTask();
        return Result.ok<boolean>(true)
    }


}