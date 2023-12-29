import { Router } from 'express';
import { Container } from 'typedi';
import config from "../../../config";
import ICreateTaskController from '../../controllers/IControllers/task/ICreateTaskController';
import { Joi, celebrate } from 'celebrate';

const route = Router();

export default (app: Router) => {
  app.use('/tasks', route);

  const ctrl = Container.get(config.controllers.task.name) as ICreateTaskController;

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

};