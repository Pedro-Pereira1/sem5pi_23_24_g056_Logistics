# US 490 - As a task manager, I want to search task requests by status, device type, or user.

## 1. Context

* First time that this user story is being implemented.
* User wants to search task requests by status, device type, or user.
* This task is relative to system user.

## 2. Requirements

**US 490 -** As a task manager, I want to search task requests by status, device type, or user.

**Dependencies:**
- US 460 - As the system user I intend to request a task, specify the parameters necessary for its execution, namely the starting point and term point and what is the intended task
- US 470 - As a task manager, I want to approve or reject a request

### Client Questions
> **Q**: Em relação a esta US, nós estamos com umas dúvidas em relação ao que o cliente considera um tipo de dispositivo, por exemplo, seria robots e drones ou tipos especificos de robots? <br>
> **A**: considerar "tipo de robot" <br>

> **Q**: Neste requisito é suposto o utilizador filtrar uma lista de requisições de tarefas ou apenas escolher o tipo de listagem (estado,tipo de dispositivo ou utente) que quer ver e mostrar lhe apenas isso.  <br>
> **A**: na listagem resultante deve ser possivel filtrar os dados pelos atributos indicados. Esta opção mostra todas as requisições do sistema, incluindo de datas passadas pelo que deverá também ser possivel filtrar por data de requisição. notem que o volume de dados pode ser muito grande pelo que devem avaliar tecnicamente como equilibrar este requisito funcional com a sua implementação tecnica. Por exemplo, ao fim de algum tempo o sistema poderá ter milhares (ou dezenas de milhares) de requisições. Embora seja aceitavel para efeitos de prototipo que existam limitações na vossa implementação, tais limitações devem ser devidamente e explcitamente documentadas bem como propostas de alternativas para contornar essas limitações. <br>

## 3. Analysis

**Analyzing this User Story we understand that:**
* Task is a request made by a user to the system to perform a certain action.
* The task can be of two types: Surveillance and Pickup & Delivery
* Surveillance task is a request made by a user to the system to perform a surveillance action in a certain building floor.
* The surveillance task information is based on: Task Type, Task Description, Task Building, Task Floor, Task Contact
* Pickup & Delivery task is a request made by a user to the system to perform a pickup & delivery action in a certain building floor.
* The pickup & delivery task information is based on: Task Type, Task Description, Task Pickup Contact, Task Delivery Contact, Task Pickup Code, Task Pickup Room, Task Delivery Room
* When i list the tasks i can filter by: Task Status, Task Device Type, Task User


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


### 4.3. Applied Patterns
* Controller
* Service
* Repository
* Mapper
* DTO
* GRASP

### 4.4. Tests
**Test 1:** **SearchTaskController unit test using SearchTaskService stub -> Valid**
```
it('SearchTaskController unit test using SearchTaskService stub -> Valid', async function () {
        // Arrange
        let body = { };
        let req: Partial<Request> = {};
          req.body = body;
          req.params = {
            userRole: "TaskManager",
            userEmail: "taskmanager@isep.ipp.pt",
            robotTypeID: "1",
            taskState: "Pending",
            user: "utente@isep.ipp.pt",
            initialDate: "null",
            finalDate: "null"
          }
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const taskDTO: ITaskDTO[] = [{
            "id": "1",
            "taskDescription": "Recolha de caneta na secretaria do departamento",
            "taskType": "Object transport",
            "taskPickupRoom": "Secretaria",
            "taskDeliveryRoom": "Sala de aula 1",
            "taskBuilding": "",
            "taskFloor": 0,
            "taskContact": "",
            "taskPickupContact": "912345678",
            "taskDeliveryContact": "912345678",
            "taskPickupCode": 1234,
            "taskRequester": "utente@isep.ipp.pt",
            "taskRequestDate": new Date(),
            "taskState": "Pending",
            "taskRobotType": "",
            "taskRobot": "",
            "taskPath": []
        }
    ];



        let searchTaskServiceInstance = Container.get("searchTaskService");
        sinon.stub(searchTaskServiceInstance, "searchTask").returns(Promise.resolve(Result.ok<ITaskDTO[]>(taskDTO)));

        let authServicesInstance = Container.get("authService");
        sinon.stub(authServicesInstance, "validateToken").returns(true);
        sinon.stub(authServicesInstance, "validatePermission").returns(true);

        let listAllTasksServiceInstance = Container.get("listAllTasksService");
        let listTaskServiceInstance = Container.get("listPendingTaskService");


        const ctrl = new ListTaskController(authServicesInstance as IAuthService,listAllTasksServiceInstance as IListAllTasksService,listTaskServiceInstance as IListPendingTaskService,searchTaskServiceInstance as ISearchTaskService);

        // Act

        await ctrl.searchTask(<Request>req, <Response>res, <NextFunction>next);


        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match(taskDTO));

    });

```

**Test 2:** **SearchTaskController unit test using SearchTaskService stub -> Invalid permission**
```
it('SearchTaskController unit test using SearchTaskService stub -> Invalid permission', async function () {
        // Arrange
        let body = { };
        let req: Partial<Request> = {};
          req.body = body;
          req.params = {
            userRole: "Utente",
            userEmail: "utente@isep.ipp.pt",
            robotTypeID: "1",
            taskState: "Pending",
            user: "utente@isep.ipp.pt",
            initialDate: "null",
            finalDate: "null"
          }
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const taskDTO: ITaskDTO[] = [{
            "id": "1",
            "taskDescription": "Recolha de caneta na secretaria do departamento",
            "taskType": "Object transport",
            "taskPickupRoom": "Secretaria",
            "taskDeliveryRoom": "Sala de aula 1",
            "taskBuilding": "",
            "taskFloor": 0,
            "taskContact": "",
            "taskPickupContact": "912345678",
            "taskDeliveryContact": "912345678",
            "taskPickupCode": 1234,
            "taskRequester": "utente@isep.ipp.pt",
            "taskRequestDate": new Date(),
            "taskState": "Pending",
            "taskRobotType": "",
            "taskRobot": "",
            "taskPath": []
        }
    ];



        let searchTaskServiceInstance = Container.get("searchTaskService");
        sinon.stub(searchTaskServiceInstance, "searchTask").returns(Promise.resolve(Result.ok<ITaskDTO[]>(taskDTO)));

        let authServicesInstance = Container.get("authService");
        sinon.stub(authServicesInstance, "validateToken").returns(false);
        sinon.stub(authServicesInstance, "validatePermission").returns(true);

        let listAllTasksServiceInstance = Container.get("listAllTasksService");
        let listTaskServiceInstance = Container.get("listPendingTaskService");


        const ctrl = new ListTaskController(authServicesInstance as IAuthService,listAllTasksServiceInstance as IListAllTasksService,listTaskServiceInstance as IListPendingTaskService,searchTaskServiceInstance as ISearchTaskService);

        // Act

        await ctrl.searchTask(<Request>req, <Response>res, <NextFunction>next);


        // Assert
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,401);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Unauthorized"));
    });
```

**Test 3:** **SearchTaskController unit test using SearchTaskService stub -> Inalid Role**
```
it('SearchTaskController unit test using SearchTaskService stub -> Inalid Role', async function () {
        // Arrange
        let body = { };
        let req: Partial<Request> = {};
          req.body = body;
          req.params = {
            userRole: "Utente",
            userEmail: "utente@isep.ipp.pt",
            robotTypeID: "1",
            taskState: "Pending",
            user: "utente@isep.ipp.pt",
            initialDate: "null",
            finalDate: "null"
          }
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const taskDTO: ITaskDTO[] = [{
            "id": "1",
            "taskDescription": "Recolha de caneta na secretaria do departamento",
            "taskType": "Object transport",
            "taskPickupRoom": "Secretaria",
            "taskDeliveryRoom": "Sala de aula 1",
            "taskBuilding": "",
            "taskFloor": 0,
            "taskContact": "",
            "taskPickupContact": "912345678",
            "taskDeliveryContact": "912345678",
            "taskPickupCode": 1234,
            "taskRequester": "utente@isep.ipp.pt",
            "taskRequestDate": new Date(),
            "taskState": "Pending",
            "taskRobotType": "",
            "taskRobot": "",
            "taskPath": []
        }
    ];



        let searchTaskServiceInstance = Container.get("searchTaskService");
        sinon.stub(searchTaskServiceInstance, "searchTask").returns(Promise.resolve(Result.ok<ITaskDTO[]>(taskDTO)));

        let authServicesInstance = Container.get("authService");
        sinon.stub(authServicesInstance, "validateToken").returns(true);
        sinon.stub(authServicesInstance, "validatePermission").returns(false);

        let listAllTasksServiceInstance = Container.get("listAllTasksService");
        let listTaskServiceInstance = Container.get("listPendingTaskService");


        const ctrl = new ListTaskController(authServicesInstance as IAuthService,listAllTasksServiceInstance as IListAllTasksService,listTaskServiceInstance as IListPendingTaskService,searchTaskServiceInstance as ISearchTaskService);

        // Act

        await ctrl.searchTask(<Request>req, <Response>res, <NextFunction>next);


        // Assert
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,401);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Unauthorized"));
    });
```

**Test 4:** **searchTaskController + searchTaskService integration test**
```
it("searchTaskController + searchTaskService integration test", async function() {
        // Arrange
        let body = { };
        let req: Partial<Request> = {};
          req.body = body;
          req.params = {
            userRole: "Utente",
            userEmail: "utente@isep.ipp.pt",
            robotTypeID: "1",
            taskState: "Pending",
            user: "utente@isep.ipp.pt",
            initialDate: "null",
            finalDate: "null"
          }
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const taskDTO: ICreateTaskDTO = {
            "taskType": "Object transport",
            "taskDescription": "Recolha de caneta na secretaria do departamento",
            "taskPickupContact": "912345678",
            "taskDeliveryContact": "912345678",
            "taskPickupCode": 1234,
            "taskPickupRoom": "Secretaria",
            "taskDeliveryRoom": "Sala de aula 1",
            "taskRequestDate": new Date(),
            "taskRequester": "utente@isep.ipp.pt",
        };

        const task = new Task(
            {
              taskDescription: TaskDescription.create({ description:taskDTO.taskDescription}).getValue(),
              taskType: TaskType.create({ type:taskDTO.taskType}).getValue(),
              taskState: TaskState.create().getValue(),
              taskPickupRoom: taskDTO.taskPickupRoom,
              taskDeliveryRoom: taskDTO.taskDeliveryRoom,
              taskPickupContact: taskDTO.taskPickupContact,
              taskDeliveryContact: taskDTO.taskDeliveryContact,
              taskPickupCode: taskDTO.taskPickupCode !== undefined ? TaskPickupCode.create({ code: taskDTO.taskPickupCode }).getValue() : undefined,
              taskRequester: taskDTO.taskRequester,
              taskRequestDate: taskDTO.taskRequestDate,
              taskRobotType: "",
              taskRobot: "",
              taskPath: [],
            },new TaskID("1"))

        const tasks = [task];


        let searchTaskServiceInstance = Container.get("searchTaskService");
        const searchTaskServiceSpy = sinon.spy(searchTaskServiceInstance, "searchTask");

        let authServicesInstance = Container.get("authService");
        sinon.stub(authServicesInstance, "validateToken").returns(true);
        sinon.stub(authServicesInstance, "validatePermission").returns(true);

        let listAllTasksServiceInstance = Container.get("listAllTasksService");
        let listTaskServiceInstance = Container.get("listPendingTaskService");

        taskRepoMock.searchTask.resolves(tasks);


        const ctrl = new ListTaskController(authServicesInstance as IAuthService,listAllTasksServiceInstance as IListAllTasksService,listTaskServiceInstance as IListPendingTaskService,searchTaskServiceInstance as ISearchTaskService);

        // Act
        await ctrl.searchTask(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match((value) => {
            return value[0].hasOwnProperty('id') && value[0].hasOwnProperty('taskRequestDate');
          }));
          sinon.assert.calledWith(res.json, sinon.match((value) => {
            return value[0].hasOwnProperty('taskBuilding') && value[0].taskBuilding === undefined
                && value[0].hasOwnProperty('taskContact') && value[0].taskContact === undefined
                && value[0].hasOwnProperty('taskDeliveryContact') && value[0].taskDeliveryContact === "912345678"
                && value[0].hasOwnProperty('taskDeliveryRoom') && value[0].taskDeliveryRoom === "Sala de aula 1"
                && value[0].hasOwnProperty('taskDescription') && value[0].taskDescription === "Recolha de caneta na secretaria do departamento"
                && value[0].hasOwnProperty('taskFloor') && value[0].taskFloor === undefined
                && value[0].hasOwnProperty('taskPath') && value[0].taskPath.length === 0
                && value[0].hasOwnProperty('taskPickupCode') && value[0].taskPickupCode === 1234
                && value[0].hasOwnProperty('taskPickupContact') && value[0].taskPickupContact === "912345678"
                && value[0].hasOwnProperty('taskPickupRoom') && value[0].taskPickupRoom === "Secretaria"
                && value[0].hasOwnProperty('taskRequester') && value[0].taskRequester === "utente@isep.ipp.pt"
                && value[0].hasOwnProperty('taskRobot') && value[0].taskRobot === ""
                && value[0].hasOwnProperty('taskRobotType') && value[0].taskRobotType === ""
                && value[0].hasOwnProperty('taskState') && value[0].taskState === "Pending"
                && value[0].hasOwnProperty('taskType') && value[0].taskType === "Object transport";
        }));
        sinon.assert.calledOnce(searchTaskServiceSpy);

      });
```

**Test 5:** **searchTaskController + searchTaskService integration test**
```
it("searchTaskController + searchTaskService integration test", async function() {
        // Arrange
        let body = { };
        let req: Partial<Request> = {};
          req.body = body;
          req.params = {
            userRole: "Utente",
            userEmail: "utente@isep.ipp.pt",
            robotTypeID: "1",
            taskState: "Pending",
            user: "utente@isep.ipp.pt",
            initialDate: "2022-12-12",
            finalDate: "2021-12-11"
          }
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const taskDTO: ITaskDTO[] = [{
            "id": "1",
            "taskDescription": "Recolha de caneta na secretaria do departamento",
            "taskType": "Object transport",
            "taskPickupRoom": "Secretaria",
            "taskDeliveryRoom": "Sala de aula 1",
            "taskBuilding": "",
            "taskFloor": 0,
            "taskContact": "",
            "taskPickupContact": "912345678",
            "taskDeliveryContact": "912345678",
            "taskPickupCode": 1234,
            "taskRequester": "utente@isep.ipp.pt",
            "taskRequestDate": new Date(),
            "taskState": "Pending",
            "taskRobotType": "",
            "taskRobot": "",
            "taskPath": []
        }
    ];


        let searchTaskServiceInstance = Container.get("searchTaskService");
        const searchTaskServiceSpy = sinon.spy(searchTaskServiceInstance, "searchTask");

        let authServicesInstance = Container.get("authService");
        sinon.stub(authServicesInstance, "validateToken").returns(true);
        sinon.stub(authServicesInstance, "validatePermission").returns(true);

        let listAllTasksServiceInstance = Container.get("listAllTasksService");
        let listTaskServiceInstance = Container.get("listPendingTaskService");

        taskRepoMock.searchTask.resolves(taskDTO);


        const ctrl = new ListTaskController(authServicesInstance as IAuthService,listAllTasksServiceInstance as IListAllTasksService,listTaskServiceInstance as IListPendingTaskService,searchTaskServiceInstance as ISearchTaskService);

        // Act
        await ctrl.searchTask(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(searchTaskServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Initial date must be before final date"));

      });
```

## 5. Implementation

#### Controller
```
public async searchTask(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }

        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["TaskManager"])){
            return res.status(401).send("Unauthorized");
        }

        try {
            const { robotTypeID, taskState, user, initialDate, finalDate } = req.params;
            //console.log(robotTypeID, taskState, user, initialDate, finalDate)
            const taskOrError = await this.searchTaskService.searchTask(robotTypeID, taskState, user, initialDate, finalDate)
            if (taskOrError.isFailure) {
                return res.status(400).send(taskOrError.error)
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
public async searchTask(robotTypeID: string, taskState: string, user: string, initialDate: string, finalDate: string): Promise<Result<Array<ITaskDTO>>> {
        try {
            if(initialDate != "null" && finalDate != "null"){
                if(new Date(initialDate).getTime() > new Date(finalDate).getTime()){
                    return Result.fail<Array<ITaskDTO>>("Initial date must be before final date");
                }
            }
            let tasks = await this.taskRepo.searchTask(robotTypeID, taskState, user, initialDate, finalDate);
            let tasksDTO: Array<ITaskDTO> = [];
            tasks.forEach(task => {
                tasksDTO.push(TaskMap.toDto(task));
            });
            return Result.ok<Array<ITaskDTO>>(tasksDTO);
        } catch (e) {
            throw e;
        }
    }
```
## 6. Integration/Demonstration
![](Diagrams/Demo.gif)

## 7. Observations
