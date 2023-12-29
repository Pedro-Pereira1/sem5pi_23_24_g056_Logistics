import { Inject, Service } from "typedi";
import { Result } from "../../core/logic/Result";
import config from "../../../config";
import ICreateTaskService from "../IServices/task/ICreateTaskService";
import ITaskRepo from "../IRepos/ITaskRepo";
import ICreateTaskDTO from "../../dto/CreateTaskDTO";
import ITaskDTO from "../../dto/TaskDTO";
import { Task } from "../../domain/Task";
import { TaskMap } from "../../mappers/TaskMap";

@Service()
export default class CreateTaskService implements ICreateTaskService {

    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo
    ) { }


    public async createTask(createTaskDTO: ICreateTaskDTO): Promise<Result<ITaskDTO>> {

        try {
            const taskOrError = Task.create(createTaskDTO)
            if (taskOrError.isFailure) {
                return Result.fail<ITaskDTO>(taskOrError.errorValue())
            }
            const taskResult = taskOrError.getValue()
            if(await this.taskRepo.findSame(taskResult).valueOf()){
                return Result.fail<ITaskDTO>("Task already exists")
            } 
            
            await this.taskRepo.save(taskResult);
            const taskDtoResult = TaskMap.toDto(taskResult) as ITaskDTO
            
            return Result.ok<ITaskDTO>(taskDtoResult)
        } catch (e) {
            throw e
        }
    }
}
