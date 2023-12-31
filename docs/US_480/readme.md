# US 480 - As a task manager, I want to search for all pending tasks.

## 1. Context

* First time that this user story is being implemented.
* This task is relative to the task manager.

## 2. Requirements

**US 480 -** As a task manager, I want to search for all pending tasks.

**Dependencies:**
- US 460 - As the system user I intend to request a task, specify the parameters necessary for its execution, namely the starting point and term point and what is the intended task

### Client Questions
> **Q**:  pretendido é consultar as requisições de tarefas que ainda não foram aprovadas, nem recusadas (ou seja, apresentar só as "pendentes"). Ou se seria pretendido consultar as tarefas "pendentes" + as tarefas recusadas. <br>
> **A**: pretende-se a listagem das requisições pendentes de decisão" <br>

> **Q**: As requisições recusadas também contam como ainda não aprovadas ou apenas as requisições pendentes de aprovação/recusacão.  <br>
> **A**:esta opção deve mostrar ao utilizador as requisções que ainda não tiveram qualquer tipo de decisão: aprovação/recusa. <br>

## 3. Analysis

**Analyzing this User Story we understand that:**
* The task manager is the user who is responsible for managing the tasks.
* The task manager can search for all pending tasks that have not yet been approved or rejected.

### 3.1. Domain Model Excerpt
![DomainModelExcerpt](Diagrams/DomainModelExcerpt.svg)

## 4. Design

### 4.1. Realization

### Level1
###### LogicalView:
![LogicalView](Diagrams/Level1/LogicalView.svg)

###### SceneryView:
![SceneryView](Diagrams/Level1/SceneryView.svg)

###### ProcessView:
![ProcessView](Diagrams/Level1/ProcessView.svg)

#### Level2

###### LogicalView:

![LogicalView](Diagrams/Level2/LogicalView.svg)

###### ImplementationView:
![ImplementationView](Diagrams/Level2/ImplementationView.svg)

###### PhysicalView:
![PhysicalView](Diagrams/Level2/PhysicalView.svg)

###### ProcessView:
![ProcessView](Diagrams/Level2/ProcessView.svg)

#### Level3
###### LogicalView:
![LogicalView](Diagrams/Level3/LogicalView.svg)

###### ImplementationView:
![ImplementationView](Diagrams/Level3/ImplementationView.svg)

###### ProcessView:
![ProcessView](Diagrams/Level3/ProcessView.svg)


### 4.2. Applied Patterns

* Controller
* Service
* Repo
* Dto

### 4.3. Tests



## 5. Implementation

#### Controller
```
public async listPendingTasks(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }

        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["TaskManager"])){
            return res.status(401).send("Unauthorized");
        }

        try {
            const taskOrError = await this.taskService.listPendingTasks()

            if (taskOrError.isFailure) {
                return res.status(400).send()
            }

            const taskDTO = taskOrError.getValue();
            return res.status(200).json(taskDTO);

        }catch (e){
            return next(e);
        }
    }
```

#### Service
```
export default class ListPendingTaskService implements IListPendingTaskService{

  constructor(@Inject(config.repos.task.name) private taskRepo: ITaskRepo) {
  }

  public async listPendingTasks(): Promise<Result<ITaskDTO[]>> {
    const tasks = await this.taskRepo.findAllPending();

    if(tasks.length === 0){
      return Result.fail<ITaskDTO[]>("No tasks found")
    }

    let resolve: ITaskDTO[] = []

    tasks.forEach(t => {
      resolve.push(TaskMap.toDto(t))
    })

    return Result.ok<ITaskDTO[]>(resolve)
  }

}
```

#### Repo
```
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
```

## 6. Integration/Demonstration

To show this functionality the user needs to authenticated in the system as a task manager. Then, the user needs to click on the "Pending Tasks" button in the menu. After logging in, the user needs to select the "Pending Tasks" option in the menu. The user will be presented with a list of all pending tasks automatically.

## 7. Observations

No observations.
