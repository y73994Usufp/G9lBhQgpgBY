// 代码生成时间: 2025-09-21 06:01:49
// Importing required modules
const fastify = require('fastify')({ logger: true });
const tap = require('tap'); // For testing purposes

// Define test cases
const testCases = [];

// Test case 1: GET /hello
testCases.push({
  method: 'GET',
  url: '/hello',
  test: async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/hello'
    });
    tap.equal(response.statusCode, 200, 'GET /hello should return 200 status code');
    tap.equal(response.json(), { hello: 'world' }, 'GET /hello should return { hello: "world" }');
  },
  name: 'Test GET /hello'
});

// Test case 2: POST /data
testCases.push({
  method: 'POST',
  url: '/data',
  test: async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/data',
      payload: { data: 'sample' }
    });
    tap.equal(response.statusCode, 200, 'POST /data should return 200 status code');
    tap.match(response.json(), { message: 'Data received' }, 'POST /data should return { message: "Data received" }');
  },
  name: 'Test POST /data'
});

// Setup Fastify routes
fastify.get('/hello', (request, reply) => {
  reply.send({ hello: 'world' });
});

fastify.post('/data', (request, reply) => {
  reply.send({ message: 'Data received' });
});

// Error handling middleware
fastify.setErrorHandler((error, request, reply) => {
  reply.status(500).send({
    error: error.message
  });
});

// Start the server and run tests
async function runServerAndTests() {
  try {
    await fastify.listen({ port: 3000 });
    console.log(`Server is listening on http://localhost:3000`);

    // Run all test cases
    for (const testCase of testCases) {
      await testCase.test();
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await fastify.close();
  }
}

runServerAndTests();