import { Inject, Service } from "typedi";
import { Result } from "../../core/logic/Result";
import config from "../../../config";
import IListAllTasksService from "../IServices/task/IListAllTasksService";
import ITaskRepo from "../IRepos/ITaskRepo";
import ITaskDTO from "../../dto/TaskDTO";
import { TaskMap } from "../../mappers/TaskMap";


@Service()
export default class listAllTasksService implements IListAllTasksService {

    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo
    )
    {}

    public async listAllTasks(): Promise<Result<ITaskDTO[]>> {
        const tasks = await this.taskRepo.findAll()

        if(tasks.length === 0) {
            return Result.fail<ITaskDTO[]>("null")
        }
        
        let resolve: ITaskDTO[] = []

        tasks.forEach(b => {
            resolve.push(TaskMap.toDto(b))
        })
        
        return Result.ok<ITaskDTO[]>(resolve)
    }

}