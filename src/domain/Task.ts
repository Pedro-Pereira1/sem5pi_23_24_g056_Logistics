import { AggregateRoot } from '../core/domain/AggregateRoot';
import { Result } from '../core/logic/Result';
import ICreateTaskDTO from '../dto/CreateTaskDTO';
import ITaskDTO from '../dto/TaskDTO';
import { TaskDescription } from './TaskDescription';
import { TaskID } from './TaskID';
import { TaskPickupCode } from './TaskPickupCode';
import { TaskState } from './TaskState';
import { TaskType } from './TaskType';

interface TaskProps {
    taskDescription: TaskDescription;
    taskType: TaskType;
    taskState: TaskState;
    taskPickupRoom: string;
    taskDeliveryRoom: string;

    taskBuilding?: string;
    taskFloor?: number;
    taskContact?: string;

    taskPickupContact?: string;
    taskDeliveryContact?: string;
    taskPickupCode?: TaskPickupCode;

    taskRequester: string;
    taskRequestDate: Date;
    taskRobotType: string;
    taskRobot: string;
    taskPath: number[][][];


}

export class Task extends AggregateRoot<TaskProps> {

  constructor(props: TaskProps, id: TaskID) {
    super(props, id);
  }

  public static create(taskDTO: ICreateTaskDTO): Result<Task> {

    if(taskDTO.taskPickupRoom === taskDTO.taskDeliveryRoom){
      return Result.fail<Task>("Pickup and delivery rooms are the same")
    }

    const taskDescriptionOrError = TaskDescription.create({ description:taskDTO.taskDescription})
    if(taskDescriptionOrError.isFailure){
          return Result.fail<Task>(taskDescriptionOrError.errorValue())
    }
    const taskDescription = taskDescriptionOrError.getValue();

    const taskTypeOrError=  TaskType.create({ type:taskDTO.taskType})
    if(taskTypeOrError.isFailure){
          return Result.fail<Task>(taskTypeOrError.errorValue())
    }
    const taskType = taskTypeOrError.getValue();

    if(taskType.type === "Floor surveillance" &&
      taskDTO.taskBuilding !== undefined && taskDTO.taskFloor !== undefined && taskDTO.taskContact !== undefined){
        if(taskDTO.taskContact.length !== 9){
          return Result.fail<Task>("Contact number is not valid")
        }
      const task = new Task(
        {
          taskDescription: taskDescription,
          taskType: taskType,
          taskState: TaskState.create().getValue(),
          taskPickupRoom: taskDTO.taskPickupRoom,
          taskDeliveryRoom: taskDTO.taskDeliveryRoom,
          taskBuilding: taskDTO.taskBuilding,
          taskFloor: taskDTO.taskFloor,
          taskContact: taskDTO.taskContact,
          taskRequester: taskDTO.taskRequester,
          taskRequestDate: taskDTO.taskRequestDate,
          taskRobotType: null,
          taskRobot: null,
          taskPath: null,
        },new TaskID(generateTaskID()))
  
      return Result.ok<Task>(task)

    }else if(taskType.type === "Object transport" &&
      taskDTO.taskPickupContact !== undefined && taskDTO.taskDeliveryContact !== undefined && taskDTO.taskPickupCode !== undefined){
        if(taskDTO.taskDeliveryContact.length !== 9 || taskDTO.taskPickupContact.length !== 9){
          return Result.fail<Task>("Contact number is not valid")
        }
      const taskPickupCodeOrError = TaskPickupCode.create({ code:taskDTO.taskPickupCode})
      if(taskPickupCodeOrError.isFailure){
            return Result.fail<Task>(taskPickupCodeOrError.errorValue())
      }
      const taskPickupCode = taskPickupCodeOrError.getValue();

      const task = new Task(
        {
          taskDescription: taskDescription,
          taskType: taskType,
          taskState: TaskState.create().getValue(),
          taskPickupRoom: taskDTO.taskPickupRoom,
          taskDeliveryRoom: taskDTO.taskDeliveryRoom,
          taskPickupContact: taskDTO.taskPickupContact,
          taskDeliveryContact: taskDTO.taskDeliveryContact,
          taskPickupCode: taskPickupCode,
          taskRequester: taskDTO.taskRequester,
          taskRequestDate: taskDTO.taskRequestDate,
          taskRobotType: null,
          taskRobot: null,
          taskPath: null,
        },new TaskID(generateTaskID()))
  
      return Result.ok<Task>(task) 
    }
    else{
      return Result.fail<Task>("Task data does not match")
    }
  }

  public static domain(taskDTO: ITaskDTO): Result<Task> {
    if(taskDTO.taskType === "Floor surveillance"){
      const task = new Task(
        {
          taskDescription: TaskDescription.create({ description:taskDTO.taskDescription}).getValue(),
          taskType: TaskType.create({ type:taskDTO.taskType}).getValue(),
          taskState: TaskState.createFromExisting(taskDTO.taskState).getValue(),
          taskPickupRoom: taskDTO.taskPickupRoom,
          taskDeliveryRoom: taskDTO.taskDeliveryRoom,
          taskBuilding: taskDTO.taskBuilding,
          taskFloor: taskDTO.taskFloor,
          taskContact: taskDTO.taskContact,
          taskRequester: taskDTO.taskRequester,
          taskRequestDate: taskDTO.taskRequestDate,
          taskRobotType: taskDTO.taskRobotType,
          taskRobot: taskDTO.taskRobot,
          taskPath: taskDTO.taskPath,
        },new TaskID(taskDTO.id))
  
      return Result.ok<Task>(task)

    }else if(taskDTO.taskType === "Object transport"){
      const task = new Task(
        {
          taskDescription: TaskDescription.create({ description:taskDTO.taskDescription}).getValue(),
          taskType: TaskType.create({ type:taskDTO.taskType}).getValue(),
          taskState: TaskState.createFromExisting(taskDTO.taskState).getValue(),
          taskPickupRoom: taskDTO.taskPickupRoom,
          taskDeliveryRoom: taskDTO.taskDeliveryRoom,
          taskPickupContact: taskDTO.taskPickupContact,
          taskDeliveryContact: taskDTO.taskDeliveryContact,
          taskRequester: taskDTO.taskRequester,
          taskRequestDate: taskDTO.taskRequestDate,
          taskRobotType: taskDTO.taskRobotType,
          taskRobot: taskDTO.taskRobot,
          taskPath: taskDTO.taskPath,
          taskPickupCode: TaskPickupCode.create({ code:taskDTO.taskPickupCode}).getValue(),
        },new TaskID(taskDTO.id))
  
      return Result.ok<Task>(task)
    
    }
  }


  get taskType(): string {
    return this.props.taskType.type;
  }

  acceptTask() {
    this.props.taskState = TaskState.createFromExisting(TaskState.Accepted).getValue()
  }

  rejectTask() {
    this.props.taskState = TaskState.createFromExisting(TaskState.Rejected).getValue()
  }  get taskDescription(): string {
    return this.props.taskDescription.description;
  }

  updateTaskPath(path: number[][][]) {
    this.props.taskPath = path;
  }

  get taskState(): string {
    return this.props.taskState.state;
  }

  get taskPickupRoom(): string {
    return this.props.taskPickupRoom;
  }

  get taskDeliveryRoom(): string {
    return this.props.taskDeliveryRoom;
  }

  get taskBuilding(): string {
    return this.props.taskBuilding;
  }

  get taskFloor(): number {
    return this.props.taskFloor;
  }

  get taskContact(): string {
    return this.props.taskContact;
  }

  get taskPickupContact(): string {
    return this.props.taskPickupContact;
  }

  get taskDeliveryContact(): string {
    return this.props.taskDeliveryContact;
  }

  get taskPickupCode(): number {
    return this.props.taskPickupCode.code;
  }

  get taskRequester(): string {
    return this.props.taskRequester;
  }

  get taskRequestDate(): Date {
    return this.props.taskRequestDate;
  }

  get taskRobotType(): string {
    return this.props.taskRobotType;
  }

  get taskRobot(): string {
    return this.props.taskRobot;
  }

  get taskPath(): number[][][] {
    return this.props.taskPath;
  }
  
  
}

function generateTaskID(): string | number {
  return Math.random().toString(36).substr(2, 8);
}

