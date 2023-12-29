import { NextFunction, Request, Response } from "express";

export default interface IObtainExecutionSequenceController {
    obtainExecutionSequence(req: Request, res: Response, next: NextFunction)
}