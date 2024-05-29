import cors from 'cors'
import express, {Express} from 'express'
import 'express-async-errors'

import indexRoutes from '../routes/indexRoutes'
import userRoutes from '../routes/userRoutes'
import projectRoutes from '../routes/projectRoutes'

import {errorHandlerMiddleware} from '../middleware/ErrorHandlerMiddleware'

const ExpressLoader = async (app: Express) => {
    app.use(cors())
    app.use(express.json())
    app.use(errorHandlerMiddleware)

    app.use('/', indexRoutes)
    app.use('/user', userRoutes)
    app.use('/project', projectRoutes)
}

export default ExpressLoader