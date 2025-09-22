// 代码生成时间: 2025-09-22 15:30:28
const fastify = require('fastify')({ logger: true });

// Middleware to format API responses
const formatResponse = async (request, reply) => {
  reply.decorate('respondWith', (data, statusCode = 200) => {
    // Create a standardized response format
    if (reply.res.statusCode >= 400) {
      return reply.send({
        error: true,
        message: 'Request failed',
        statusCode,
        payload: data,
      });
    }
    return reply.send({
      error: false,
      message: 'Request successful',
      statusCode,
      payload: data,
    });
  });
};

// Register the response formatter middleware
fastify.register(formatResponse, { prefix: '/api' });

// Example route using the middleware
fastify.get('/test', async (request, reply) => {
  try {
    // Simulate some data fetching and processing
    const result = { message: 'Hello, World!' };
    // Use the custom response formatter
    return reply.respondWith(result);
  } catch (error) {
    // Handle any errors and send a formatted error response
    return reply.respondWith(error, 500);
  }
});

// Error handling middleware
fastify.setErrorHandler((error, request, reply) => {
  reply.code(error.statusCode || 500);
  reply.respondWith({
    error: true,
    message: 'An unexpected error occurred',
    statusCode: reply.statusCode,
    payload: error.message,
  });
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
