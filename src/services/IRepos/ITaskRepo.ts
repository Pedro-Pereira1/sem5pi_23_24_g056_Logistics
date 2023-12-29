import { Repo } from "../../core/infra/Repo";
import { Result } from "../../core/logic/Result";
import { Task } from "../../domain/Task";

export default interface ITaskRepo extends Repo<Task> {
    save(task: Task): Promise<Task>
    findById(id: string): Promise<Task>
    findSame(task: Task): Promise<Boolean>
}