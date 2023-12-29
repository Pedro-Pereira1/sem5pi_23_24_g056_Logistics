import { NextFunction, Request, Response } from "express";

export default interface IListTaskController {
    listTasksByParameter(req: Request, res: Response, next: NextFunction),
    listNotApprovedTasks(req: Request, res: Response, next: NextFunction)
}