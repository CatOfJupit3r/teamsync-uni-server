import cors from 'cors'
import express, {Express} from 'express'
import 'express-async-errors'

import indexRoutes from '../routes/indexRoutes'
import userRoutes from '../routes/userRoutes'

import {errorHandlerMiddleware} from '../middleware/ErrorHandlerMiddleware'

const ExpressLoader = async (app: Express) => {
    app.use(cors())
    app.use(express.json())

    app.use('/', indexRoutes)
    // app.use('/translations', translationRoutes)
    app.use('/user', userRoutes)
    // app.use('/lobby', lobbyRoutes)
    // app.use('/combat', combatRoutes)
    // app.use('/entity', entityRoutes)
    // app.use('/assets', assetRoutes)

    app.use(errorHandlerMiddleware)
}

export default ExpressLoader