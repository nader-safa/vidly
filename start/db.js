import Mongoose from 'mongoose'
import config from 'config'
import winston from 'winston'

const connectToMongoDB = async () => {
  winston.info('connecting to mongodb...')
  await Mongoose.connect(
    `mongodb+srv://${config.get('db.user')}:${config.get(
      config.get('env') === 'production'
        ? 'db.prod_password'
        : 'db.dev_password'
    )}@${config.get('db.cluster')}/${config.get(
      'db.database'
    )}?retryWrites=true&w=majority`
  )
  winston.info('connected to mongodb')
}

export default connectToMongoDB
