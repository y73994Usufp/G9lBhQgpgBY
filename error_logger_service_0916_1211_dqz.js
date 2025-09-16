// 代码生成时间: 2025-09-16 12:11:24
const fastify = require('fastify')({ logger: true });

// Error Logger Service
class ErrorLoggerService {
  // Constructor for ErrorLoggerService
  constructor() {
    this.errorLogs = [];
  }

  // Method to log errors
  logError(error) {
    this.errorLogs.push({
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack
    });
    console.error(error);
  }

  // Method to get all error logs
  getAllErrorLogs() {
    return this.errorLogs;
  }
}

// Create an instance of ErrorLoggerService
const errorLogger = new ErrorLoggerService();

// Error handling middleware
fastify.setErrorHandler((error, request, reply) => {
  errorLogger.logError(error);
  reply.send(error);
});

// Route to get all error logs
fastify.get('/error-logs', async (request, reply) => {
  try {
    const logs = errorLogger.getAllErrorLogs();
    reply.code(200).send({
      logs
    });
  } catch (error) {
    errorLogger.logError(error);
    reply.code(500).send({
      error: 'Internal Server Error'
    });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running on ${fastify.server.address().port}`);
  } catch (error) {
    errorLogger.logError(error);
    process.exit(1);
  }
};

start();