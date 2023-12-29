import { Inject, Service } from "typedi";
import { Result } from "../../core/logic/Result";
import config from "../../../config";
import ICreateTaskService from "../IServices/task/ICreateTaskService";
import ITaskRepo from "../IRepos/ITaskRepo";
import ICreateTaskDTO from "../../dto/CreateTaskDTO";
import ITaskDTO from "../../dto/TaskDTO";

@Service()
export default class CreateTaskService implements ICreateTaskService {

    constructor(
        @Inject(config.repos.task.name) private taskRepo: ITaskRepo
    ) { }


    public async createTask(createTaskDTO: ICreateTaskDTO): Promise<Result<ITaskDTO>> {

        try {
            //const robotTypeExists = await this.robotTypeRepo.findById(robotTypeDTO.robotTypeID)
            //if(robotTypeExists != null){
            //    return Result.fail<IRobotTypeDTO>("RobotType already exists")
            //}
            //
            //const robotTypeOrError = RobotType.create(robotTypeDTO,robotTypeDTO.robotTypeID)
            //if (robotTypeOrError.isFailure) {
            //    return Result.fail<IRobotTypeDTO>(robotTypeOrError.errorValue())
            //}
            //
            //const robotTypeResult = robotTypeOrError.getValue()
            //await this.robotTypeRepo.save(robotTypeResult);
            //const robotTypeDtoResult = RobotTypeMap.toDto(robotTypeResult) as IRobotTypeDTO
            //
            //return Result.ok<IRobotTypeDTO>(robotTypeDtoResult)
            return null

        } catch (e) {
            throw e
        }
    }
}
