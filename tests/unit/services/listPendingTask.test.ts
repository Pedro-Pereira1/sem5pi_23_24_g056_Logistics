import CreateTaskDTO from "../../../src/dto/CreateTaskDTO";
import {Task} from "../../../src/domain/Task";
import {Container} from "typedi";
import sinon from 'sinon'
import { NextFunction, Request, Response } from "express";
import assert from "assert";
import ListPendingTaskService from "../../../src/services/task/ListPendingTaskService";
import {Result} from "../../../src/core/logic/Result";
import ListTaskController from "../../../src/controllers/task/ListTaskController";
import {TaskMap} from "../../../src/mappers/TaskMap";
import ITaskDTO from "../../../src/dto/TaskDTO";
import {IAuthService} from "../../../src/services/IServices/auth/IAuthService";
import IListAllTasksService from "../../../src/services/IServices/task/IListAllTasksService";
import IListPendingTaskService from "../../../src/services/IServices/task/IListPendingTaskService";
import ISearchTaskService from "../../../src/services/IServices/task/ISearchTaskService";

describe('ListPendingTask', () => {

  const pendingTaskDto = {
    taskDescription: "Test Description",
    taskType: "Floor surveillance",
    taskPickupRoom: "B101",
    taskDeliveryRoom: "B103",
    taskBuilding: "B",
    taskFloor: 11,
    taskContact: "912913914",
    taskRequester: "utente@isep.ipp.pt",
    taskRequestDate: new Date()
  } as CreateTaskDTO

  const pendingTask = Task.create(pendingTaskDto)

  const pendingTaskDto2 = {
    taskDescription: "Test Description",
    taskType: "Floor surveillance",
    taskPickupRoom: "B101",
    taskDeliveryRoom: "B104",
    taskBuilding: "B",
    taskFloor: 11,
    taskContact: "912913914",
    taskRequester: "utente@isep.ipp.pt",
    taskRequestDate: new Date()
  } as CreateTaskDTO

  const pendingTask2 = Task.create(pendingTaskDto2)

  beforeEach(() => {
    Container.reset()

    let taskSchema = require('../../../src/persistence/schemas/TaskSchema').default
    Container.set('taskSchema', taskSchema)

    let taskRepoClass = require('../../../src/repos/TaskRepo').default
    let taskRepoInstance = Container.get(taskRepoClass)
    Container.set('TaskRepo', taskRepoInstance)

    let listPendingTaskServiceClass = require('../../../src/services/task/ListPendingTaskService').default
    let listPendingTaskServiceInstance = Container.get(listPendingTaskServiceClass)
    Container.set('listTaskService', listPendingTaskServiceInstance)

    let listTaskControllerClass = require('../../../src/controllers/task/ListTaskController').default
    let listTaskControllerInstance = Container.get(listTaskControllerClass)
    Container.set('listTasksController', listTaskControllerInstance)
  })

  it('1. controller with stub service valid', async () => {
    const task = pendingTask.getValue()
    const task2 = pendingTask2.getValue()

    const result = [task, task2]

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
      finalDate: "null",
    }
      let res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    };
    let next: Partial<NextFunction> = () => { }

    let authServicesInstance = Container.get("authService");
    sinon.stub(authServicesInstance, "validateToken").returns(true);
    sinon.stub(authServicesInstance, "validatePermission").returns(true);

    const listPendingTaskService = Container.get('listTaskService')
    sinon.stub(listPendingTaskService, 'listPendingTasks').returns(new Promise((resolve, reject) => {
      resolve(Result.ok<Task[]>(result))
    }))

    const controller = Container.get('listTasksController') as ListTaskController

    await controller.listPendingTasks(<Request>req, <Response>res, <NextFunction>next)

    sinon.assert.calledOnce(res.status)
    sinon.assert.calledWith(res.status, 200)
    sinon.assert.calledOnce(res.json)
    sinon.assert.calledWith(res.json, sinon.match(result))
  })

  it('2. controller with stub service no tasks', async () => {
    let req: Partial<Request> = {}
    let res: Partial<Response> = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    }
    let next: Partial<NextFunction> = () => { }

    const listPendingTaskService = Container.get('listTaskService') as ListPendingTaskService
    sinon.stub(listPendingTaskService, 'listPendingTasks').returns(new Promise((resolve, reject) => {
      resolve(Result.fail<Task[]>('null'))
    }))

    const controller = Container.get('listTasksController') as ListTaskController

    await controller.listPendingTasks(<Request>req, <Response>res, <NextFunction>next)

    sinon.assert.calledOnce(res.status)
    sinon.assert.calledWith(res.status, 400)
    sinon.assert.calledOnce(res.send)
  })

  it('3. Service with stub repo valid', async () => {
    const task = pendingTask.getValue()
    const task2 = pendingTask2.getValue()

    const taskRes1 =TaskMap.toDto(task)
    const taskRes2 =TaskMap.toDto(task2)

    const expected = [taskRes1, taskRes2]

    const repoReturns = [task, task2]

    const taskRepo = Container.get('TaskRepo')
    sinon.stub(taskRepo, 'findAllPending').returns(new Promise((resolve, reject) => {
      resolve(repoReturns)
    }))

    const listPendingTaskService = Container.get('listTaskService') as ListPendingTaskService
    const result = await listPendingTaskService.listPendingTasks()

    sinon.assert.match(result.getValue(), expected)
  })

  it('4. Service with stub repo no tasks', async () => {
    const taskRepo = Container.get('TaskRepo')
    sinon.stub(taskRepo, 'findAllPending').returns(new Promise((resolve, reject) => {
      resolve([])
    }))

    const listPendingTaskService = Container.get('listTaskService') as ListPendingTaskService
    const result = await listPendingTaskService.listPendingTasks()

    sinon.assert.match(result.isFailure, true)
  })

  it('5. Controller + Service with stub repo valid', async () => {
    const task = pendingTask.getValue()
    const task2 = pendingTask2.getValue()

    const taskRes1 =TaskMap.toDto(task)
    const taskRes2 =TaskMap.toDto(task2)

    const expected = [taskRes1, taskRes2]

    const repoReturns = [task, task2]

    let req: Partial<Request> = {}
    let res: Partial<Response> = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    }
    let next: Partial<NextFunction> = () => { }

    const taskRepo = Container.get('TaskRepo')
    sinon.stub(taskRepo, 'findAllPending').returns(new Promise((resolve, reject) => {
      resolve(repoReturns)
    }))

    const listPendingTaskService = Container.get('listTaskService') as ListPendingTaskService
    const controller = Container.get('listTasksController') as ListTaskController

    await controller.listPendingTasks(<Request>req, <Response>res, <NextFunction>next)

    sinon.assert.calledOnce(res.status)
    sinon.assert.calledWith(res.status, 200)
    sinon.assert.calledOnce(res.json)
    sinon.assert.calledWith(res.json, sinon.match(expected))
  })

  it('6. Controller + Service with stub repo no tasks', async () => {
    const taskRepo = Container.get('TaskRepo')
    sinon.stub(taskRepo, 'findAllPending').returns(new Promise((resolve, reject) => {
      resolve([])
    }))

    let req: Partial<Request> = {}
    let res: Partial<Response> = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy()
    }
    let next: Partial<NextFunction> = () => { }

    const listPendingTaskService = Container.get('listTaskService') as ListPendingTaskService
    const controller = Container.get('listTasksController') as ListTaskController

    await controller.listPendingTasks(<Request>req, <Response>res, <NextFunction>next)

    sinon.assert.calledOnce(res.status)
    sinon.assert.calledWith(res.status, 400)
    sinon.assert.calledOnce(res.send)
  })

  /*
  it('7. controller with stub service invalid role', async function () {
    const task = pendingTask.getValue()
    const task2 = pendingTask2.getValue()

    const result = [task, task2]

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

    const listPendingTaskService = Container.get('listTaskService')
    sinon.stub(listPendingTaskService, 'listPendingTasks').returns(new Promise((resolve, reject) => {
      resolve(Result.ok<Task[]>(result))
    }))

    let authServicesInstance = Container.get("authService");
    sinon.stub(authServicesInstance, "validateToken").returns(false);
    sinon.stub(authServicesInstance, "validatePermission").returns(true);

    const controller = Container.get('listTasksController') as ListTaskController

    await controller.listPendingTasks(<Request>req, <Response>res, <NextFunction>next);

    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status,401);
    sinon.assert.calledOnce(res.send);
    sinon.assert.calledWith(res.send, sinon.match("Unauthorized"));
  });
   */
})
