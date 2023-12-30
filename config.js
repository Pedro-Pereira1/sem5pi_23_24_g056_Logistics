import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4001 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4001, 

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb://mongoadmin:efedbaf0eaf1cbc595fc3db1@vsgate-s1.dei.isep.ipp.pt:11278/?authMechanism=DEFAULT",


  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    task: {
      name: "TaskController",
      path: "../controllers/task/createTaskController"
    },
    auth: {
      name: "authController",
      path: "../controllers/auth/AuthController"
    },
  },

  repos: {
    task: {
      name: "TaskRepo",
      path: "../repos/taskRepo"
    },
    
  },

  services: {
    task: {
      name: "TaskService",
      path: "../services/task/createTaskService"
    },
    auth: {
      name: "authService",
      path: "../services/auth/AuthService"
    },
    acceptRejectTask: {
      name: "acceptRejectTaskService",
      path: "../services/task/AcceptRejectTaskService"
    },
  },
};
