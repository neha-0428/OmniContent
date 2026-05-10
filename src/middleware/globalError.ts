import { NextFunction, Request, Response } from "express";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(err.name === 'ZodError') {
        return res.status(400).json({
            status: 'fail',
            message: 'Validation Error',
            errors: err.errors.map((e: any) => ({ path: e.path[0], message: e.message }))
        })
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
}