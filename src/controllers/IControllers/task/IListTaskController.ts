import { NextFunction, Request, Response } from "express";
import { ParsedQs } from "qs";

export default interface IListTaskController {
    listAcceptedTasks(req: Request, res: Response, next: NextFunction): unknown;
    searchTask(req: Request, res: Response, next: NextFunction),
    listPendingTasks(req: Request, res: Response, next: NextFunction),
    listAllTasks(req: Request, res: Response, next: NextFunction)
}
