import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import assert from 'assert';
import { Result } from '../../src/core/logic/Result';
import ICreateTaskDTO from '../../src/dto/CreateTaskDTO';
import { Task } from '../../src/domain/Task';
import ITaskDTO from '../../src/dto/TaskDTO';
import CreateTaskController from '../../src/controllers/task/CreateTaskController';
import ICreateTaskService from '../../src/services/IServices/task/ICreateTaskService';
import { IAuthService } from '../../src/services/IServices/auth/IAuthService';
import ListTaskController from '../../src/controllers/task/ListTaskController';
import IListAllTasksService from '../../src/services/IServices/task/IListAllTasksService';
import IListPendingTaskService from '../../src/services/IServices/task/IListPendingTaskService';
import ISearchTaskService from '../../src/services/IServices/task/ISearchTaskService';
import { TaskID } from '../../src/domain/TaskID';
import { TaskPickupCode } from '../../src/domain/TaskPickupCode';
import { TaskDescription } from '../../src/domain/TaskDescription';
import { TaskType } from '../../src/domain/TaskType';
import { TaskState } from '../../src/domain/TaskState';

describe("Search Task", function () {
    this.timeout(5000);
    const sandbox = sinon.createSandbox();
    let taskRepoMock;


    beforeEach(function () {
        Container.reset();

        taskRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
            findSame: sinon.stub(),
            findAll: sinon.stub(),
            findAllPending: sinon.stub(),
            searchTask: sinon.stub()
        };
        Container.set('TaskRepo', taskRepoMock);

        let taskSchemaInstance = require('../../src/persistence/schemas/TaskSchema').default
        Container.set('taskSchema', taskSchemaInstance)

        let authServicesClass = require('../../src/services/auth/AuthService').default
        let authServicesInstance = Container.get(authServicesClass)
        Container.set('authService', authServicesInstance)

        let searchTaskServiceClass = require('../../src/services/task/SearchTaskService').default
        let searchTaskServiceInstance = Container.get(searchTaskServiceClass)
        Container.set('searchTaskService', searchTaskServiceInstance)

        let listAllTasksServiceClass = require('../../src/services/task/ListAllTasksService').default
        let listAllTasksServiceInstance = Container.get(listAllTasksServiceClass)
        Container.set('listAllTasksService', listAllTasksServiceInstance)

        let listPendingTaskServiceClass = require('../../src/services/task/ListPendingTaskService').default
        let listPendingTaskServiceInstance = Container.get(listPendingTaskServiceClass)
        Container.set('listPendingTaskService', listPendingTaskServiceInstance)

    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

    

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

      
});
