import { Inject, Service } from "typedi";
import { Result } from "../../core/logic/Result";
import ITaskDTO from "../../dto/TaskDTO";
import { IListAcceptedTasksService } from "../IServices/task/IListAcceptedTasksService";
import config from "../../../config";
import ITaskRepo from "../IRepos/ITaskRepo";
import { Task } from "../../domain/Task";
import { TaskState } from "../../domain/TaskState";
import { TaskMap } from "../../mappers/TaskMap";

@Service()
export class ListAcceptedTasksService implements IListAcceptedTasksService {

    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo
    ) 
    { }

    public async listAcceptedTasks(): Promise<Result<ITaskDTO[]>> {
        const allTasks: Task[] = await this.taskRepo.findAll();
        if (allTasks === null) return Result.fail<ITaskDTO[]>("No tasks found");
        let acceptedTasks: ITaskDTO[] = [];
        for (const task of allTasks) {
            if (task.taskState === TaskState.Accepted) {
                acceptedTasks.push(TaskMap.toDto(task));
            }
        }
        return Result.ok<ITaskDTO[]>(acceptedTasks);
    }

}