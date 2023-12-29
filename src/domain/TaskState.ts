import { initial } from 'lodash';
import { ValueObject } from '../core/domain/ValueObject';
import { Result } from '../core/logic/Result';

  
  interface TaskStateProps {
    state: string;
  }

  export class TaskState extends ValueObject<TaskStateProps> {

    constructor (props : TaskStateProps){
      super(props);
    }
    
    get state(): string {
      return this.props.state
    }
    
    public static create(): Result<TaskState> {
        return Result.ok<TaskState>(new TaskState({state:"Pending"}))
    }

    public static createFromExisting(state: string): Result<TaskState> {
      return Result.ok<TaskState>(new TaskState({state:state}))
    }

  }
