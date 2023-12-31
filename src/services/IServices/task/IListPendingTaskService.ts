import ITaskDTO from "../../../dto/TaskDTO";
import {Result} from "../../../core/logic/Result";


export default interface IListPendingTaskService {
  listPendingTasks(): Promise<Result<ITaskDTO[]>>
}
