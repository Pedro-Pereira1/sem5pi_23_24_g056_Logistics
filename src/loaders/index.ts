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

  const acceptRejectTaskController = {
    name: config.controllers.acceptRejectTask.name,
    path: config.controllers.acceptRejectTask.path
  }

  const listTaskController = {
    name: config.controllers.listTasks.name,
    path: config.controllers.listTasks.path
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

  const acceptRejectTaskService = {
    name: config.services.acceptRejectTask.name,
    path: config.services.acceptRejectTask.path
  }

  const listTaskService = {
    name: config.services.listTask.name,
    path: config.services.listTask.path
  }

  const listAllTaskService = {
    name: config.services.listAllTasks.name,
    path: config.services.listAllTasks.path
  }

  const searchTaskService = {
    name: config.services.searchTask.name,
    path: config.services.searchTask.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      taskSchema
    ],
    controllers: [
      authController,
      taskController,
      acceptRejectTaskController,
      listTaskController
    ],
    repos: [
      taskRepo
    ],
    services: [
      authService,
      taskService,
      acceptRejectTaskService,
      listAllTaskService,
      listTaskService,
      searchTaskService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
