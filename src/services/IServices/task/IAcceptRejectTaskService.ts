import { Result } from "../../../core/logic/Result";

export interface IAcceptRejectTaskService {
    acceptOrRejectTask(taskID: string, accept: boolean): Promise<Result<boolean>>
}