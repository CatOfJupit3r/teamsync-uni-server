import cors from 'cors'
import express, {Express} from 'express'
import 'express-async-errors'

import indexRoutes from '../routes/indexRoutes'
import userRoutes from '../routes/userRoutes'
import projectRoutes from '../routes/projectRoutes'

import {errorHandlerMiddleware} from '../middleware/ErrorHandlerMiddleware'
import {authenticationMiddleware} from "../middleware/AuthenticationMiddleware";

const ExpressLoader = async (app: Express) => {
    app.use(cors())
    app.use(express.json())

    app.use('/', indexRoutes)
    app.use('/user', authenticationMiddleware, userRoutes)
    app.use('/project', authenticationMiddleware, projectRoutes)

    app.use(errorHandlerMiddleware)
}

export default ExpressLoader