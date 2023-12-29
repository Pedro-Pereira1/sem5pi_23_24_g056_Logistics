import { AggregateRoot } from '../core/domain/AggregateRoot';
import { Result } from '../core/logic/Result';
import ICreateTaskDTO from '../dto/CreateTaskDTO';
import { TaskDescription } from './TaskDescription';
import { TaskID } from './TaskID';

interface TaskProps {
    taskDescription: string;

}

export class Task extends AggregateRoot<TaskProps> {

  constructor(props: TaskProps, id: TaskID) {
    super(props, id);
  }

  public static create(taskDTO: ICreateTaskDTO): Result<Task> {

    const taskDescriptionOrError=  TaskDescription.create({ description:taskDTO.description})
        if(taskDescriptionOrError.isFailure){
              return Result.fail<Task>(taskDescriptionOrError.errorValue())
        }

        const robotBrand = taskDescriptionOrError.getValue();

    const task = new Task(
      {
        taskDescription: robotBrand.model
      },new TaskID(taskDTO.id))

    return Result.ok<Task>(task)
  }
}
