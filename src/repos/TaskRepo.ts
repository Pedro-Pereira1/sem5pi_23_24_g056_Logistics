import { Inject, Service } from "typedi";
import { Document, FilterQuery, Model } from 'mongoose';
import { Result } from "../core/logic/Result";
import ITaskRepo from "../services/IRepos/ITaskRepo";
import ITaskPersistence from "../dataschema/ITaskPersistence";
import { Task } from "../domain/Task";
import { TaskMap } from "../mappers/TaskMap";

@Service()
export default class TaskRepo implements ITaskRepo {

  constructor(
    @Inject('taskSchema') private taskSchema: Model<ITaskPersistence & Document>
  ) { }

  async exists(task: Task): Promise<boolean> {
    const query = { taskID: task.id.toString() };
    const taskRecord = await this.taskSchema.findOne(query as FilterQuery<ITaskPersistence & Document>);
    if (taskRecord != null) {
      return true;
    }
    else
      return false;
  }

  public async save(task: Task): Promise<Task> {
    const query = { id: task.id };
    const taskDocument = await this.taskSchema.findOne(query);

    try {
      if (taskDocument === null) {
        const rawTask: any = TaskMap.toPersistence(task);
        const taskCreated = await this.taskSchema.create(rawTask);
        return TaskMap.toDomain(taskCreated);

      } else {
        taskDocument.taskState = task.props.taskState.props.state;

        await taskDocument.save();
        return task;
     }
    } catch (err) {
      throw err;
    }
  }

  public async findById(id: string): Promise<Task> {
    const query = { id: id.toString() };
    const taskRecord = await this.taskSchema.findOne(query as FilterQuery<ITaskPersistence & Document>);
    if (taskRecord != null) {
      return TaskMap.toDomain(taskRecord);
    }
    else
      return null;
  }

  public async findAllPending(): Promise<Task[]> {
    const query = { taskState: "Pending" };
    const taskRecord = await this.taskSchema.find(query as FilterQuery<ITaskPersistence & Document>);
    let tasks: Task[] = [];
    for (const element of taskRecord) {
      const task = await TaskMap.toDomain(element);
      tasks.push(task);
    }
    return tasks;
  }

public async findSame(task: Task): Promise<Boolean> {
  let query2 = {};
  if(task.taskType === "Floor surveillance") {
    query2 = {
      taskDescription: task.props.taskDescription.props.description,
      taskType: task.props.taskType.props.type,
      taskState: task.props.taskState.props.state,
      taskPickupRoom: task.props.taskPickupRoom,
      taskDeliveryRoom: task.props.taskDeliveryRoom,
      taskBuilding: task.props.taskBuilding,
      taskFloor: task.props.taskFloor,
      taskContact: task.props.taskContact
    };
  } else if(task.taskType === "Object transport") {
    query2 = {
      taskDescription: task.props.taskDescription.props.description,
      taskType: task.props.taskType.props.type,
      taskState: task.props.taskState.props.state,
      taskPickupRoom: task.props.taskPickupRoom,
      taskDeliveryRoom: task.props.taskDeliveryRoom,
      taskPickupContact: task.props.taskPickupContact,
      taskDeliveryContact: task.props.taskDeliveryContact,
      taskPickupCode: task.props.taskPickupCode.props.code
    };
  }
  const taskDocument2 = await this.taskSchema.findOne(query2);

  if (taskDocument2 !== null) {
    return true;
  }
  else
    return false;
  }

  public async findAll(): Promise<Task[]> {
    let tasks: Task[] = []

    const cursor = this.taskSchema.find<Task>({});

    for await (let doc of cursor) {
        tasks.push(await TaskMap.toDomain(doc))
    }
    return tasks
}

}
