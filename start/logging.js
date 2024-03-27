import winston from 'winston'

const initializeWinston = () => {
  winston.add(
    new winston.transports.File({
      filename: 'logfile.log',
      handleExceptions: true,
      handleRejections: true,
      level: 'error',
    })
  )

  winston.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      handleExceptions: true,
      handleRejections: true,
      level: 'info',
    })
  )
}

export default initializeWinston
