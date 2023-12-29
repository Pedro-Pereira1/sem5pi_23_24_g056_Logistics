import { initial } from 'lodash';
import { ValueObject } from '../core/domain/ValueObject';
import { Result } from '../core/logic/Result';

  
  interface TaskPickupCodeProps {
    code: number;
  }

  export class TaskPickupCode extends ValueObject<TaskPickupCodeProps> {

    constructor (props : TaskPickupCodeProps){
      super(props);
    }
    
    get code(): number {
      return this.props.code
    }
    
    public static create(props: TaskPickupCodeProps): Result<TaskPickupCode> {
        if (props.code > 1000 && props.code < 999999) {
            return Result.ok<TaskPickupCode>(new TaskPickupCode(props))
          } else {
            return Result.fail<TaskPickupCode>("Task pickup code must be 4-6 digits")
        }
    }

  }
