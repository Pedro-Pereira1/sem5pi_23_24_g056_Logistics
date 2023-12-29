import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');


  const taskSchema = {
    name: 'taskSchema',
    schema: '../persistence/schemas/taskSchema',
  };

  const authController = {
    name: config.controllers.auth.name,
    path: config.controllers.auth.path
  }

  const taskController = {
    name: config.controllers.task.name,
    path: config.controllers.task.path
  }


  const taskRepo = {
    name: config.repos.task.name,
    path: config.repos.task.path
  }

  const authService = {
    name: config.services.auth.name,
    path: config.services.auth.path
}

  const taskService = {
    name: config.services.task.name,
    path: config.services.task.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      taskSchema
    ],
    controllers: [
      authController,
      taskController
    ],
    repos: [
      taskRepo
    ],
    services: [
      authService,
      taskService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};