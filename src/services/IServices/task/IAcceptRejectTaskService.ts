import { Result } from "../../../core/logic/Result";
import { AcceptRejectTaskDTO } from "../../../dto/AcceptRejectTaskDTO";

export interface IAcceptRejectTaskService {
    acceptOrRejectTask(acceptRejectTaskDTO: AcceptRejectTaskDTO): Promise<Result<boolean>>
}