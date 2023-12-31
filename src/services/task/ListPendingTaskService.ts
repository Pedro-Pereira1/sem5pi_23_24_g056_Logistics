import {Inject, Service} from "typedi";
import IListPendingTaskService from "../IServices/task/IListPendingTaskService";
import {Result} from "../../core/logic/Result";
import ITaskDTO from "../../dto/TaskDTO";
import ITaskRepo from "../IRepos/ITaskRepo";
import config from "../../../config";
import {TaskMap} from "../../mappers/TaskMap";

@Service()

export default class ListPendingTaskService implements IListPendingTaskService{

  constructor(@Inject(config.repos.task.name) private taskRepo: ITaskRepo) {
  }

  public async listPendingTasks(): Promise<Result<ITaskDTO[]>> {
    const tasks = await this.taskRepo.findAllPending();

    if(tasks.length === 0){
      return Result.fail<ITaskDTO[]>("No tasks found")
    }

    let resolve: ITaskDTO[] = []

    tasks.forEach(t => {
      resolve.push(TaskMap.toDto(t))
    })

    return Result.ok<ITaskDTO[]>(resolve)
  }

}
