import { Router } from 'express';
import { Container } from 'typedi';
import config from "../../../config";
import ICreateTaskController from '../../controllers/IControllers/task/ICreateTaskController';
import { Joi, celebrate } from 'celebrate';
import AcceptRejectTaskController from '../../controllers/task/AcceptRejectTaskController';
import IListTaskController from "../../controllers/IControllers/task/IListTaskController";

const route = Router();

export default (app: Router) => {
  app.use('/tasks', route);

  const ctrl = Container.get(config.controllers.task.name) as ICreateTaskController;
  const acceptRejectTaskController = Container.get(config.controllers.acceptRejectTask.name) as AcceptRejectTaskController;
  const ctrlList = Container.get(config.controllers.listTask.name) as IListTaskController;

  route.post('/createTask',
    celebrate({
      body: Joi.object({
        taskDescription: Joi.string().required(),
        taskType: Joi.string().required(),
        taskPickupRoom: Joi.string().required(),
        taskDeliveryRoom: Joi.string().required(),
        taskBuilding: Joi.string(),
        taskFloor: Joi.number(),
        taskContact: Joi.string().length(9),
        taskPickupContact: Joi.string().length(9),
        taskDeliveryContact: Joi.string().length(9),
        taskPickupCode: Joi.number(),
      })
    }),
    (req, res, next) => ctrl.createTask(req, res, next) );

    route.patch('/acceptRejectTask',
    celebrate({
      body: Joi.object({
        taskID: Joi.string().required(),
        accept: Joi.boolean().required(),
      })
    }), (req, res, next) => acceptRejectTaskController.acceptRejectTask(req, res, next))

    route.get('/listPendingTasks', (req, res, next) => {
      ctrlList.listPendingTasks(req, res, next)
    });

    route.get('/listAllTasks', (req, res, next) => {
      ctrlList.listAllTasks(req, res, next)
    });

};
