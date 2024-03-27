import 'express-async-errors'
import express from 'express'
import config from 'config'
import winston from 'winston'

import createRouters from './src/routes/index.js'
import connectToMongoDB from './start/db.js'
import initializeWinston from './start/logging.js'
import initializeConfig from './start/config.js'

const app = express()

initializeWinston()
initializeConfig()
connectToMongoDB()
createRouters(app)

const port = config.get('port') || 3000

app.listen(port, () => winston.info(`app started on port ${port}...`))
