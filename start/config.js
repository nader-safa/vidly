import config from 'config'

const initializeConfig = () => {
  if (!config.get('jwt_secret'))
    throw new Error('FATAL ERROR: jwt_secret is not defined.')

  if (!config.get('db.user'))
    throw new Error('FATAL ERROR: db.user is not defined.')

  if (!config.get('db.dev_password') && !config.get('db.prod_password'))
    throw new Error('FATAL ERROR: db password is not defined.')

  if (!config.get('db.database'))
    throw new Error('FATAL ERROR: db.database is not defined.')

  if (!config.get('db.cluster'))
    throw new Error('FATAL ERROR: db.cluster is not defined.')
}

export default initializeConfig
