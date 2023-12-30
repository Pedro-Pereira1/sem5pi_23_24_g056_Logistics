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

describe("Create Task", function () {
    this.timeout(5000);
    const sandbox = sinon.createSandbox();
    let taskRepoMock;


    beforeEach(function () {
        Container.reset();

        taskRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
            findSame: sinon.stub()
        };
        Container.set('TaskRepo', taskRepoMock);

        let taskSchemaInstance = require('../../src/persistence/schemas/TaskSchema').default
        Container.set('taskSchema', taskSchemaInstance)

        let authServicesClass = require('../../src/services/auth/AuthService').default
        let authServicesInstance = Container.get(authServicesClass)
        Container.set('authService', authServicesInstance)

        let createTaskServiceClass = require('../../src/services/task/CreateTaskService').default
        let createTaskServiceInstance = Container.get(createTaskServiceClass)
        Container.set('createTaskService', createTaskServiceInstance)

    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

    it('should create a Object transport Task instance with valid input', function () {
        // Arrange
        const taskDTO: ICreateTaskDTO  = {
            "taskDescription" : "Recolha de caneta na secretaria do departamento" ,
            "taskType" : "Object transport" ,
            "taskPickupRoom" : "D112" ,
            "taskDeliveryRoom" : "D113" ,
            "taskPickupContact" : "912345678" ,
            "taskDeliveryContact" : "912345679" ,
            "taskPickupCode" : 1234 ,
            "taskRequester" : "utente@isep.ipp.pt" ,
            "taskRequestDate" : new Date()
        }

        // Act
        const result = Task.create(taskDTO);

        // Assert
        assert.ok(result.isSuccess);
        assert.ok(result.getValue() instanceof Task);
        assert.strictEqual(result.getValue().taskDescription, taskDTO.taskDescription);
        assert.strictEqual(result.getValue().taskType, taskDTO.taskType);
        assert.strictEqual(result.getValue().taskPickupRoom, taskDTO.taskPickupRoom);
        assert.strictEqual(result.getValue().taskDeliveryRoom, taskDTO.taskDeliveryRoom);
        assert.strictEqual(result.getValue().taskPickupContact, taskDTO.taskPickupContact);
        assert.strictEqual(result.getValue().taskDeliveryContact, taskDTO.taskDeliveryContact);
        assert.strictEqual(result.getValue().taskPickupCode, taskDTO.taskPickupCode);
        assert.strictEqual(result.getValue().taskRequester, taskDTO.taskRequester);
        assert.strictEqual(result.getValue().taskRequestDate, taskDTO.taskRequestDate);
        
    });

    it('should create a Task instance with valid input', function () {
        // Arrange
        const taskDTO: ICreateTaskDTO  = {
            "taskDescription" : "Vigilância do piso 1 do edifício D" ,
            "taskType" : "Floor surveillance" ,
            "taskPickupRoom" : "D112" ,
            "taskDeliveryRoom" : "D113" ,
            "taskBuilding" : "D" ,
            "taskFloor" : 1 ,
            "taskContact" : "912345678" ,
            "taskRequester" : "utente@isep.ipp.pt" ,
            "taskRequestDate" : new Date()
        }

        // Act
        const result = Task.create(taskDTO);

        // Assert
        assert.ok(result.isSuccess);
        assert.ok(result.getValue() instanceof Task);
        assert.strictEqual(result.getValue().taskDescription, taskDTO.taskDescription);
        assert.strictEqual(result.getValue().taskType, taskDTO.taskType);
        assert.strictEqual(result.getValue().taskPickupRoom, taskDTO.taskPickupRoom);
        assert.strictEqual(result.getValue().taskDeliveryRoom, taskDTO.taskDeliveryRoom);
        assert.strictEqual(result.getValue().taskBuilding, taskDTO.taskBuilding);
        assert.strictEqual(result.getValue().taskFloor, taskDTO.taskFloor);
        assert.strictEqual(result.getValue().taskContact, taskDTO.taskContact);
        assert.strictEqual(result.getValue().taskRequester, taskDTO.taskRequester);
        assert.strictEqual(result.getValue().taskRequestDate, taskDTO.taskRequestDate);
    });

    it('should fail to create a Task instance with task Type', function () {
        // Arrange
        const taskDTO: ICreateTaskDTO  = {
            "taskDescription" : "Vigilância do piso 1 do edifício D" ,
            "taskType" : "Surveillance" ,
            "taskPickupRoom" : "D112" ,
            "taskDeliveryRoom" : "D113" ,
            "taskBuilding" : "D" ,
            "taskFloor" : 1 ,
            "taskContact" : "912345678" ,
            "taskRequester" : "utente@isep.ipp.pt" ,
            "taskRequestDate" : new Date()
        }

        // Act
        const result = Task.create(taskDTO);

        // Assert
        assert.ok(result.isFailure);
        assert.strictEqual(result.errorValue(), "Task not available");
    });

    it('should fail to create a Task instance with missing data', function () {
        // Arrange
        const taskDTO: ICreateTaskDTO  = {
            "taskDescription" : "Vigilância do piso 1 do edifício D" ,
            "taskType" : "Floor surveillance" ,
            "taskPickupRoom" : "D112" ,
            "taskDeliveryRoom" : "D113" ,
            "taskBuilding" : "D" ,
            "taskContact" : "912345678" ,
            "taskRequester" : "utente@isep.ipp.pt" ,
            "taskRequestDate" : new Date()
        }

        // Act
        const result = Task.create(taskDTO);

        // Assert
        assert.ok(result.isFailure);
        assert.strictEqual(result.errorValue(), "Task data does not match");
    });

    it('should fail to create a Task instance with same taskPickupRoom and taskDeliveryRoom', function () {
        // Arrange
        const taskDTO: ICreateTaskDTO  = {
            "taskDescription" : "Vigilância do piso 1 do edifício D" ,
            "taskType" : "Floor surveillance" ,
            "taskPickupRoom" : "D112" ,
            "taskDeliveryRoom" : "D112" ,
            "taskBuilding" : "D" ,
            "taskFloor" : 1 ,
            "taskContact" : "912345678" ,
            "taskRequester" : "utente@isep.ipp.pt" ,
            "taskRequestDate" : new Date()
        }

        // Act
        const result = Task.create(taskDTO);

        // Assert
        assert.ok(result.isFailure);
        assert.strictEqual(result.errorValue(), "Pickup and delivery rooms are the same");
    });

    it('should fail to create a Task instance with invalid Description', function () {
        // Arrange
        const taskDTO: ICreateTaskDTO  = {
            "taskDescription" : "Vigilância do piso 1 do edifício D".repeat(100) ,
            "taskType" : "Floor surveillance" ,
            "taskPickupRoom" : "D112" ,
            "taskDeliveryRoom" : "D111" ,
            "taskBuilding" : "D" ,
            "taskFloor" : 1 ,
            "taskContact" : "912345678" ,
            "taskRequester" : "utente@isep.ipp.pt" ,
            "taskRequestDate" : new Date()
        }

        // Act
        const result = Task.create(taskDTO);

        // Assert
        assert.ok(result.isFailure);
        assert.strictEqual(result.errorValue(), "Task description must be 1-1000 characters");
    });

    it('should fail to create a Task instance with invalid taskContact', function () {
        // Arrange
        const taskDTO: ICreateTaskDTO  = {
            "taskDescription" : "Vigilância do piso 1 do edifício D" ,
            "taskType" : "Floor surveillance" ,
            "taskPickupRoom" : "D112" ,
            "taskDeliveryRoom" : "D111" ,
            "taskBuilding" : "D" ,
            "taskFloor" : 1 ,
            "taskContact" : "9123456781" ,
            "taskRequester" : "utente@isep.ipp.pt" ,
            "taskRequestDate" : new Date()
        }

        // Act
        const result = Task.create(taskDTO);

        // Assert
        assert.ok(result.isFailure);
        assert.strictEqual(result.errorValue(), "Contact number is not valid");
    });

    it('should fail to create a Task instance with invalid taskPickupContact and taskDeliveryContact', function () {
        // Arrange
        const taskDTO: ICreateTaskDTO  = {
            "taskDescription" : "Recolha de caneta na secretaria do departamento" ,
            "taskType" : "Object transport" ,
            "taskPickupRoom" : "D112" ,
            "taskDeliveryRoom" : "D113" ,
            "taskPickupContact" : "912345678" ,
            "taskDeliveryContact" : "9123456791" ,
            "taskPickupCode" : 1234 ,
            "taskRequester" : "utente@isep.ipp.pt" ,
            "taskRequestDate" : new Date()
        }

        // Act
        const result = Task.create(taskDTO);

        // Assert
        assert.ok(result.isFailure);
        assert.strictEqual(result.errorValue(), "Contact number is not valid");
    });

    it('should fail to create a Task instance with invalid taskPickupCode', function () {
        // Arrange
        const taskDTO: ICreateTaskDTO  = {
            "taskDescription" : "Recolha de caneta na secretaria do departamento" ,
            "taskType" : "Object transport" ,
            "taskPickupRoom" : "D112" ,
            "taskDeliveryRoom" : "D113" ,
            "taskPickupContact" : "912345678" ,
            "taskDeliveryContact" : "912345679" ,
            "taskPickupCode" : 1234567 ,
            "taskRequester" : "utente@isep.ipp.pt" ,
            "taskRequestDate" : new Date()
        }

        // Act
        const result = Task.create(taskDTO);

        // Assert
        assert.ok(result.isFailure);
        assert.strictEqual(result.errorValue(), "Task pickup code must be 4-6 digits");
    });

    it('createRobotTypeController unit test using createRobotTypeService stub', async function () {
        // Arrange
        let body = {
            "taskType": "Object transport",
            "taskDescription": "Recolha de caneta na secretaria do departamento",
            "taskPickupContact": "912345678",
            "taskDeliveryContact": "912345678",
            "taskPickupCode": 1234,
            "taskPickupRoom": "Secretaria",
            "taskDeliveryRoom": "Sala de aula 1",
        };
        let req: Partial<Request> = {};
          req.body = body;
          req.params = {
            userRole: "Utente",
            userEmail: "utente@isep.ipp.pt"
          }
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const taskDTO: ITaskDTO = {
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
        };



        let createTaskServiceInstance = Container.get("createTaskService");
        sinon.stub(createTaskServiceInstance, "createTask").returns(Promise.resolve(Result.ok<ITaskDTO>(taskDTO)));

        let authServicesInstance = Container.get("authService");
        sinon.stub(authServicesInstance, "validateToken").returns(true);
        sinon.stub(authServicesInstance, "validatePermission").returns(true);

        const ctrl = new CreateTaskController(authServicesInstance as IAuthService,createTaskServiceInstance as ICreateTaskService);

        // Act
        
        await ctrl.createTask(<Request>req, <Response>res, <NextFunction>next);
        

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match(taskDTO));

    });

    it("createTaskController +createTaskService integration test Repetead Task", async function() {
        // Arrange
        let body = {
            "taskType": "Object transport",
            "taskDescription": "Recolha de caneta na secretaria do departamento",
            "taskPickupContact": "912345678",
            "taskDeliveryContact": "912345678",
            "taskPickupCode": 1234,
            "taskPickupRoom": "Secretaria",
            "taskDeliveryRoom": "Sala de aula 1",
        };
        let req: Partial<Request> = {        };
            req.body = body;
            req.params = {
              userRole: "Utente",
              userEmail: "utente@isep.ipp.pt"
            }
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        const taskDTO: ITaskDTO = {
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
        };
        
        taskRepoMock.findSame.resolves(null);
        
        let createTaskServiceInstance = Container.get("createTaskService");
        const createTaskServiceSpy = sinon.spy(createTaskServiceInstance, "createTask");

        let authServicesInstance = Container.get("authService");
        sinon.stub(authServicesInstance, "validateToken").returns(true);
        sinon.stub(authServicesInstance, "validatePermission").returns(true);

        

        const ctrl = new CreateTaskController(authServicesInstance as IAuthService,createTaskServiceInstance as ICreateTaskService);

        // Act
        await ctrl.createTask(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match((value) => {
            return value.hasOwnProperty('id') && value.hasOwnProperty('taskRequestDate');
          }));
        sinon.assert.calledWith(res.json, sinon.match.has("taskBuilding", undefined)
            .and(sinon.match.has("taskContact", undefined))
            .and(sinon.match.has("taskDeliveryContact", "912345678"))
            .and(sinon.match.has("taskDeliveryRoom", "Sala de aula 1"))
            .and(sinon.match.has("taskDescription", "Recolha de caneta na secretaria do departamento"))
            .and(sinon.match.has("taskFloor", undefined))
            .and(sinon.match.has("taskPath", null))
            .and(sinon.match.has("taskPickupCode", 1234))
            .and(sinon.match.has("taskPickupContact", "912345678"))
            .and(sinon.match.has("taskPickupRoom", "Secretaria"))
            .and(sinon.match.has("taskRequester", undefined))
            .and(sinon.match.has("taskRobot", null))
            .and(sinon.match.has("taskRobotType", null))
            .and(sinon.match.has("taskState", "Pending"))
            .and(sinon.match.has("taskType", "Object transport")));
        sinon.assert.calledOnce(createTaskServiceSpy);

      }); 

      it("createTaskController +createTaskService integration test", async function() {
        // Arrange
        let body = {
            "taskType": "Object transport",
            "taskDescription": "Recolha de caneta na secretaria do departamento",
            "taskPickupContact": "912345678",
            "taskDeliveryContact": "912345678",
            "taskPickupCode": 1234,
            "taskPickupRoom": "Secretaria",
            "taskDeliveryRoom": "Sala de aula 1",
        };
        let req: Partial<Request> = {        };
            req.body = body;
            req.params = {
              userRole: "Utente",
              userEmail: "utente@isep.ipp.pt"
            }
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        const taskDTO: ITaskDTO = {
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
        };
        
        taskRepoMock.findSame.resolves(taskDTO);
        
        let createTaskServiceInstance = Container.get("createTaskService");
        const createTaskServiceSpy = sinon.spy(createTaskServiceInstance, "createTask");

        let authServicesInstance = Container.get("authService");
        sinon.stub(authServicesInstance, "validateToken").returns(true);
        sinon.stub(authServicesInstance, "validatePermission").returns(true);

        

        const ctrl = new CreateTaskController(authServicesInstance as IAuthService,createTaskServiceInstance as ICreateTaskService);

        // Act
        await ctrl.createTask(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createTaskServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Task already exists"));
      });     
});
