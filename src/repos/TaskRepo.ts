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

    const query = { taskID: task.id.toString() };

    const taskDocument = await this.taskSchema.findOne(query);

    try {
      if (taskDocument === null) {
        const rawTask: any = TaskMap.toPersistence(task);
        const taskCreated = await this.taskSchema.create(rawTask);
        return TaskMap.toDomain(taskCreated);

      } else {
        if(task.props.taskDescription !== undefined){
          taskDocument.description = task.props.taskDescription;
        }

        await taskDocument.save();
        return task;
     }
    } catch (err) {
      throw err;
    }
  }

  public async findById(id: string): Promise<Task> {
    const query = { taskID: id.toString() };
    const taskRecord = await this.taskSchema.findOne(query as FilterQuery<ITaskPersistence & Document>);
    if (taskRecord != null) {
      return TaskMap.toDomain(taskRecord);
    }
    else
      return null;
  }

  

}
