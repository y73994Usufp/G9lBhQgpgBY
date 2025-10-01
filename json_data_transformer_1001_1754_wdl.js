// 代码生成时间: 2025-10-01 17:54:42
const fastify = require('fastify')({ logger: true });

// Define the JSON data transformer function
function transformJsonData(inputJson) {
  // Check if the input is a valid JSON string
  try {
    const jsonData = JSON.parse(inputJson);
    return JSON.stringify(jsonData, null, 2); // Pretty print the JSON
  } catch (error) {
    throw new Error('Invalid JSON input.');
  }
}

// Create a route to handle JSON data transformation
fastify.post('/json-transform', async (request, reply) => {
  // Extract the JSON string from the request body
  const { jsonInput } = request.body;

  // Validate the input
  if (!jsonInput) {
    reply.code(400).send({ error: 'Missing JSON input.' });
    return;
  }

  // Transform the JSON data
  try {
    const transformedJson = transformJsonData(jsonInput);
    reply.send({ transformedJson });
  } catch (error) {
    // Handle errors during transformation
    reply.code(500).send({ error: error.message });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is listening on port 3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
