import { Result } from "../../../core/logic/Result";
import ITaskDTO from "../../../dto/TaskDTO";

export default interface IListAllTasksService {
    listAllTasks(): Promise<Result<ITaskDTO[]>>
}