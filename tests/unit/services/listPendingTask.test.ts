import CreateTaskDTO from "../../../src/dto/CreateTaskDTO";
import {Task} from "../../../src/domain/Task";
import {Container} from "typedi";
import sinon from 'sinon'
import AcceptRejectTaskService from "../../../src/services/task/AcceptRejectTaskService";

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
    Container.set('ListPendingTaskService', listPendingTaskServiceInstance)
  })

  it('1. should return true if task is accepted', async () => {
    const task = pendingTask.getValue()
    const taskRepo = Container.get('TaskRepo')
    sinon.stub(taskRepo, 'findById').returns(new Promise((resolve, reject) => {
      resolve(task)
    }))
    sinon.stub(taskRepo, 'save').returns(null)
    const service = Container.get('AcceptRejectTaskService') as AcceptRejectTaskService
    const result = await service.acceptOrRejectTask({ taskID: task.id.toString(), accept: true })
    sinon.assert.match(result.isSuccess, true)
  })

})
