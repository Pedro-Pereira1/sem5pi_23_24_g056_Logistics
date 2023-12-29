import { Document, Model } from "mongoose";
import { Mapper } from "../core/infra/Mapper";
import Container from "typedi";
import config from "../../config";
import { Task } from "../domain/Task";
import ITaskDTO from "../dto/TaskDTO";
import ITaskPersistence from "../dataschema/ITaskPersistence";
import ITaskRepo from "../services/IRepos/ITaskRepo";

export class TaskMap extends Mapper<Task> {

    public static toDto(task: Task): ITaskDTO {
        if(task.props.taskPickupCode === undefined){
            return {
                id: task.id.toString(),
                taskDescription: task.props.taskDescription.description,
                taskType: task.props.taskType.type,
                taskState: task.props.taskState.state,
                taskBuilding: task.props.taskBuilding,
                taskFloor: task.props.taskFloor,
                taskContact: task.props.taskContact,
                taskPickupContact: task.props.taskPickupContact,
                taskDeliveryContact: task.props.taskDeliveryContact,
                taskPickupRoom: task.props.taskPickupRoom,
                taskDeliveryRoom: task.props.taskDeliveryRoom,
            };
        }
        return {
            id: task.id.toString(),
            taskDescription: task.props.taskDescription.description,
            taskType: task.props.taskType.type,
            taskState: task.props.taskState.state,
            taskBuilding: task.props.taskBuilding,
            taskFloor: task.props.taskFloor,
            taskContact: task.props.taskContact,
            taskPickupContact: task.props.taskPickupContact,
            taskDeliveryContact: task.props.taskDeliveryContact,
            taskPickupCode: task.props.taskPickupCode.code,
            taskPickupRoom: task.props.taskPickupRoom,
            taskDeliveryRoom: task.props.taskDeliveryRoom,
        };
    }

    public static async toDomain(taskDTO: any | Model<ITaskPersistence & Document>): Promise<Task> {
        const TaskOrError = Task.domain(taskDTO);
        return TaskOrError.isSuccess ? TaskOrError.getValue() : null
    }

    public static toPersistence(task: Task): ITaskDTO {
        if(task.props.taskPickupCode === undefined){
            return {
                id: task.id.toString(),
                taskDescription: task.props.taskDescription.description,
                taskType: task.props.taskType.type,
                taskState: task.props.taskState.state,
                taskBuilding: task.props.taskBuilding,
                taskFloor: task.props.taskFloor,
                taskContact: task.props.taskContact,
                taskPickupContact: task.props.taskPickupContact,
                taskDeliveryContact: task.props.taskDeliveryContact,
                taskPickupRoom: task.props.taskPickupRoom,
                taskDeliveryRoom: task.props.taskDeliveryRoom,
            };
        }
        return {
            id: task.id.toString(),
            taskDescription: task.props.taskDescription.description,
            taskType: task.props.taskType.type,
            taskState: task.props.taskState.state,
            taskBuilding: task.props.taskBuilding,
            taskFloor: task.props.taskFloor,
            taskContact: task.props.taskContact,
            taskPickupContact: task.props.taskPickupContact,
            taskDeliveryContact: task.props.taskDeliveryContact,
            taskPickupCode: task.props.taskPickupCode.code,
            taskPickupRoom: task.props.taskPickupRoom,
            taskDeliveryRoom: task.props.taskDeliveryRoom,
        };
    }
}
