enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

export const logger = {
  info: (message: string, meta?: any) => log(LogLevel.INFO, message, meta),
  warn: (message: string, meta?: any) => log(LogLevel.WARN, message, meta),
  error: (message: string, meta?: any) => log(LogLevel.ERROR, message, meta),
  debug: (message: string, meta?: any) => log(LogLevel.DEBUG, message, meta),
};

function log(level: LogLevel, message: string, meta?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(meta && { meta }),
  };

  if (level === LogLevel.ERROR) {
    console.error(JSON.stringify(logEntry));
  } else if (level === LogLevel.WARN) {
    console.warn(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
}
