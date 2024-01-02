import { Inject, Service } from "typedi";
import { IAcceptRejectTaskService } from "../IServices/task/IAcceptRejectTaskService";
import { Result } from "../../core/logic/Result";
import { AcceptRejectTaskDTO } from "../../dto/AcceptRejectTaskDTO";
import ITaskRepo from "../IRepos/ITaskRepo";
import config from "../../../config";
import { TaskState } from "../../domain/TaskState";
import { Task } from "../../domain/Task";

@Service()
export default class AcceptRejectTaskService implements IAcceptRejectTaskService {

    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo
    ) { }

    public async acceptOrRejectTask(dto: AcceptRejectTaskDTO): Promise<Result<boolean>> {
        const task: Task = await this.taskRepo.findById(dto.taskID);
        if (task === null) return Result.fail<boolean>("Task not found");

        if (task.taskState === TaskState.Accepted || task.taskState === TaskState.Rejected) {
            return Result.fail<boolean>("Task already accepted or rejected")
        }

        if (dto.accept) {
            if (dto.path === undefined || dto.path === null || dto.path.length === 0) {
                return Result.fail<boolean>("Path not provided")
            }
            task.acceptTask();
            task.updateTaskPath(dto.path);
        } else {
            task.rejectTask();
        }
        this.taskRepo.save(task);
        return Result.ok<boolean>(true)
    }
}