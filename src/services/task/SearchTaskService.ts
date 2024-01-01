import { Inject, Service } from "typedi";
import { Result } from "../../core/logic/Result";
import config from "../../../config";
import IListAllTasksService from "../IServices/task/IListAllTasksService";
import ITaskRepo from "../IRepos/ITaskRepo";
import ITaskDTO from "../../dto/TaskDTO";
import { TaskMap } from "../../mappers/TaskMap";
import ISearchTaskService from "../IServices/task/ISearchTaskService";


@Service()
export default class SearchTaskService implements ISearchTaskService {

    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo
    )
    {}

    public async searchTask(robotTypeID: string, taskState: string, user: string, initialDate: string, finalDate: string): Promise<Result<Array<ITaskDTO>>> {
        try {
            if(initialDate != "null" && finalDate != "null"){
                if(new Date(initialDate).getTime() > new Date(finalDate).getTime()){
                    return Result.fail<Array<ITaskDTO>>("Initial date must be before final date");
                }
            }
            let tasks = await this.taskRepo.searchTask(robotTypeID, taskState, user, initialDate, finalDate);
            let tasksDTO: Array<ITaskDTO> = [];
            tasks.forEach(task => {
                tasksDTO.push(TaskMap.toDto(task));
            });
            return Result.ok<Array<ITaskDTO>>(tasksDTO);
        } catch (e) {
            throw e;
        }
    }

}