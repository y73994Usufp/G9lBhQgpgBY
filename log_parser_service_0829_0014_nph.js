// 代码生成时间: 2025-08-29 00:14:18
// Import required modules
const fs = require('fs');
const fastify = require('fastify')({ logger: true });
const path = require('path');

// Define the log file path
const logFilePath = path.join(__dirname, 'log.txt');

// Function to parse the log file
function parseLogFile(logFilePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const logLines = data.split('
');
        const parsedLogs = logLines.map(line => {
          try {
            // Assuming log lines are in the format: [timestamp] [level] message
            const parts = line.split(' ');
            const timestamp = parts[0] + ' ' + parts[1];
            const level = parts[2];
            const message = parts.slice(3).join(' ');
            return { timestamp, level, message };
          } catch (error) {
            return null;
          }
        }).filter(log => log !== null);
        resolve(parsedLogs);
      }
    });
  });
}

// Create a route to handle GET requests to parse log file
fastify.get('/parse', async (request, reply) => {
  try {
    const parsedLogs = await parseLogFile(logFilePath);
    reply.send({
      status: 'success',
      data: parsedLogs
    });
  } catch (error) {
    reply.status(500).send({
      status: 'error',
      message: 'Failed to parse log file',
      error: error.message
    });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info('Server is running on http://localhost:3000');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();