import { initial } from 'lodash';
import { ValueObject } from '../core/domain/ValueObject';
import { Result } from '../core/logic/Result';

  
  interface TaskDescriptionProps {
    description: string;
  }

  export class TaskDescription extends ValueObject<TaskDescriptionProps> {

    constructor (props : TaskDescriptionProps){
      super(props);
    }
    
    get model(): string {
      return this.props.description
    }
    
    public static create(taskDescription: TaskDescriptionProps): Result<TaskDescription> {
      if (taskDescription.description.length < 1 || taskDescription.description.length > 1000) {
        return Result.fail<TaskDescription>("Task description must be 1-1000 characters")
      } else {
        return Result.ok<TaskDescription>(new TaskDescription(taskDescription))
      }
    }

  }
