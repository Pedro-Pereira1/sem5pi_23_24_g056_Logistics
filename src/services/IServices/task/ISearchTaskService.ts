import { Result } from "../../../core/logic/Result";
import ITaskDTO from "../../../dto/TaskDTO";

export default interface ISearchTaskService {
    searchTask(robotTypeID: string, taskState: string, user: string, initialDate: string, finalDate: string): Promise<Result<ITaskDTO[]>>;
}