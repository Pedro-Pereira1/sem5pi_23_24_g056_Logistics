import { Result } from "../../../core/logic/Result";
import ITaskDTO from "../../../dto/TaskDTO";

export interface IListAcceptedTasksService {
    listAcceptedTasks(): Promise<Result<ITaskDTO[]>>;
}