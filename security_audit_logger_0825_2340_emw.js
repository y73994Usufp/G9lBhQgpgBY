// 代码生成时间: 2025-08-25 23:40:07
const fastify = require('fastify')({
  logger: true
});

// Middleware to log incoming requests
fastify.use((req, res, next) => {
  req.log.info({
    event: 'request_received',
    method: req.method,
    url: req.url,
    headers: req.headers
  }, 'Request received');
  next();
});

// POST endpoint to log security events
fastify.post('/security-event', async (request, reply) => {
  try {
    // Verify if the event data is provided
    if (!request.body || !request.body.event) {
      reply.code(400).send({
        error: 'Invalid data',
        message: 'Event data must contain an event property'
      });
      return;
    }

    // Log the security event
    request.log.info({
      event: request.body.event,
      details: request.body.details
    }, 'Security event logged');

    // Send a success response
    reply.send({
      status: 'success',
      message: 'Security event logged successfully'
    });
  } catch (error) {
    // Handle any unexpected errors
    request.log.error(error);
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
});

// Error handling middleware
fastify.setErrorHandler((err, request, reply) => {
  request.log.error(err);
  reply.code(500).send({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// Start the server
const startServer = async () => {
  try {
    await fastify.listen({
      port: 3000,
      host: '0.0.0.0'
    });
    fastify.log.info('Server is listening on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Run the server
startServer();