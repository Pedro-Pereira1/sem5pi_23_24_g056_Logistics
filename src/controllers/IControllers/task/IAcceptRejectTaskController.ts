import { NextFunction, Request, Response } from "express";

export default interface IAcceptRejectTaskController {
    acceptRejectTask(req: Request, res: Response, next: NextFunction)
}