import { NextFunction, Request, Response } from "express";

export default interface ICreateTaskController {
    createTask(req: Request, res: Response, next: NextFunction)
}