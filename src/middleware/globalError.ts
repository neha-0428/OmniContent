import { NextFunction, Request, Response } from "express";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(err.name === 'ZodError') {
        const validationIssues = err.issues || err.errors || [];
        return res.status(400).json({
            status: 'fail',
            message: 'Validation Error',
            errors: validationIssues.map((e: any) => ({ path: e.path[e.path.length - 1], message: e.message }))
        })
    }

    // Handle Mongoose Duplicate Key (11000)
    if (err.code === 11000) {
        return res.status(400).json({ status: 'fail', message: 'Duplicate field value entered' });
    }

    res.status(err.statusCode).json({
        status: err.status || 'error',
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
}