import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from "../../../config";
import ICreateTaskController from '../../controllers/IControllers/task/ICreateTaskController';
var validateToken = require('../middlewares/validateToken');

const route = Router();

export default (app: Router) => {
  app.use('/tasks', route);

  const ctrl = Container.get(config.controllers.task.name) as ICreateTaskController;

  route.post('/createTask', validateToken,
    celebrate({
      body: Joi.object({
        taskDescription: Joi.string().required(),
        taskType: Joi.string().required(),
        taskPickupRoom: Joi.string().required(),
        taskDeliveryRoom: Joi.string().required(),
        taskBuilding: Joi.string(),
        taskFloor: Joi.number(),
        taskContact: Joi.string(),
        taskPickupContact: Joi.string(),
        taskDeliveryContact: Joi.string(),
        taskPickupCode: Joi.number(),        
      })
    }),
    (req, res, next) => ctrl.createTask(req, res, next) );

};