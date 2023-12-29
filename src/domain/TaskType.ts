import { initial } from 'lodash';
import { ValueObject } from '../core/domain/ValueObject';
import { Result } from '../core/logic/Result';

  
  interface TaskTypeProps {
    type: string;
  }

  export class TaskType extends ValueObject<TaskTypeProps> {

    constructor (props : TaskTypeProps){
      super(props);
    }
    
    get type(): string {
      return this.props.type
    }
    
    public static create(props: TaskTypeProps): Result<TaskType> {
        if (props.type === "Floor surveillance" || props.type === "Object transport") {
            return Result.ok<TaskType>(new TaskType(props))
          } else {
            return Result.fail<TaskType>("Task not available")
        }
    }

  }
