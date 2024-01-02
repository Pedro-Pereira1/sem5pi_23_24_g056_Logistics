import 'reflect-metadata'

import { Container } from 'typedi'
import sinon from 'sinon'
import assert from 'assert'
import { Task } from '../../../src/domain/Task'
import { TaskDescription } from '../../../src/domain/TaskDescription'
import CreateTaskDTO from '../../../src/dto/CreateTaskDTO'
import AcceptRejectTaskService from '../../../src/services/task/AcceptRejectTaskService'

describe('acceptRejectTask', () => {

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
    taskDeliveryRoom: "B103",
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

    let acceptRejectTaskServiceClass = require('../../../src/services/task/AcceptRejectTaskService').default
    let acceptRejectTaskServiceInstance = Container.get(acceptRejectTaskServiceClass)
    Container.set('AcceptRejectTaskService', acceptRejectTaskServiceInstance)
  })

  it('1. should return true if task is accepted', async () => {
    const task = pendingTask.getValue()
    const taskRepo = Container.get('TaskRepo')
    sinon.stub(taskRepo, 'findById').returns(new Promise((resolve, reject) => {
      resolve(task)
    }))
    sinon.stub(taskRepo, 'save').returns(null)
    const service = Container.get('AcceptRejectTaskService') as AcceptRejectTaskService
    const result = await service.acceptOrRejectTask({ taskID: task.id.toString(), accept: true, path: [[[1,2]]] })
    sinon.assert.match(result.isSuccess, true)
  })

  it('2. should return true if task is rejected', async () => {
    const task = pendingTask2.getValue()
    const taskRepo = Container.get('TaskRepo')
    sinon.stub(taskRepo, 'findById').returns(new Promise((resolve, reject) => {
      resolve(task)
    }))
    sinon.stub(taskRepo, 'save').returns(null)
    const service = Container.get('AcceptRejectTaskService') as AcceptRejectTaskService
    const result = await service.acceptOrRejectTask({ taskID: task.id.toString(), accept: false })
    sinon.assert.match(result.isSuccess, true)
  })

  it('3. should return false if task is already accepted', async () => {
    const task = pendingTask.getValue()
    const taskRepo = Container.get('TaskRepo')
    sinon.stub(taskRepo, 'findById').returns(new Promise((resolve, reject) => {
      resolve(task)
    }))
    sinon.stub(taskRepo, 'save').returns(null)
    const service = Container.get('AcceptRejectTaskService') as AcceptRejectTaskService
    const result = await service.acceptOrRejectTask({ taskID: task.id.toString(), accept: false })
    sinon.assert.match(result.isSuccess, false)
  })

  it('4. should return false if task is already rejected', async () => {
    const task = pendingTask2.getValue()
    const taskRepo = Container.get('TaskRepo')
    sinon.stub(taskRepo, 'findById').returns(new Promise((resolve, reject) => {
      resolve(task)
    }))
    sinon.stub(taskRepo, 'save').returns(null)
    const service = Container.get('AcceptRejectTaskService') as AcceptRejectTaskService
    const result = await service.acceptOrRejectTask({ taskID: task.id.toString(), accept: false })
    sinon.assert.match(result.isSuccess, false)
  })

  it('5. should return false if task is not found', async () => {
    const taskRepo = Container.get('TaskRepo')
    sinon.stub(taskRepo, 'findById').returns(new Promise((resolve, reject) => {
      resolve(null)
    }))
    sinon.stub(taskRepo, 'save').returns(null)
    const service = Container.get('AcceptRejectTaskService') as AcceptRejectTaskService
    const result = await service.acceptOrRejectTask({ taskID: "1234", accept: false })
    sinon.assert.match(result.isSuccess, false)
  })


})