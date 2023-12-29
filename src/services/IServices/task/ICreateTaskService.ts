import { Result } from "../../../core/logic/Result";
import ICreateTaskDTO from "../../../dto/CreateTaskDTO";
import ITaskDTO from "../../../dto/TaskDTO";

export default interface ICreateTaskService {
    createTask(taskDTO: ICreateTaskDTO): Promise<Result<ITaskDTO>>
}
