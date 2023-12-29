import { Document, Model } from "mongoose";
import { Mapper } from "../core/infra/Mapper";
import Container from "typedi";
import config from "../../config";
import { Task } from "../domain/Task";
import ITaskDTO from "../dto/TaskDTO";
import ITaskPersistence from "../dataschema/ITaskPersistence";


export class TaskMap extends Mapper<Task> {

    public static toDto(task: Task): ITaskDTO {
        return {
            id: task.id.toValue(),
            description: task.props.taskDescription
        } as ITaskDTO
    }

    public static async toDomain(taskDTO: any | Model<ITaskPersistence & Document>): Promise<Task> {

        const TaskOrError = Task.create(taskDTO)

        return TaskOrError.isSuccess ? TaskOrError.getValue() : null
    }

    public static toPersistence(task: Task): any {
        return {
            id: task.id.toValue(),
            description: task.props.taskDescription
        } as ITaskDTO
    }
}
