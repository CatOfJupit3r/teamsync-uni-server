import { Express } from 'express'
import http from 'http'
import DatabaseLoader from './database'
import ExpressLoader from './express'

const RootLoader = async (app: Express, server: http.Server) => {
    console.log('Starting root loader...')

    console.log('Connecting to database...')
    await DatabaseLoader()
    console.log('Database connected successfully!')

    console.log('Starting express server...')
    await ExpressLoader(app)
    console.log('Express server started successfully!')
}

export default RootLoader