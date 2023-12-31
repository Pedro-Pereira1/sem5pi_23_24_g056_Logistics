import { NextFunction, Request, Response } from "express";

export default interface IListTaskController {
    listTasksByParameter(req: Request, res: Response, next: NextFunction),
    listPendingTasks(req: Request, res: Response, next: NextFunction),
    listAllTasks(req: Request, res: Response, next: NextFunction)
}
