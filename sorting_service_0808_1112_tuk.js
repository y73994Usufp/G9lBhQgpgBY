// 代码生成时间: 2025-08-08 11:12:06
const fastify = require('fastify')({ logger: true });

// Function to sort an array using a simple sorting algorithm (e.g., bubble sort)
const bubbleSort = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap the elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
};

// Route to handle sorting requests
fastify.post('/sort', async (request, reply) => {
  // Extract the array from the request body
  const { array } = request.body;
  
  // Check if the array is valid
  if (!Array.isArray(array) || array.some(isNaN)) {
    return reply.status(400).send({
      error: 'Invalid input: Please provide a valid array of numbers.'
    });
  }
  
  // Perform the sort
  try {
    const sortedArray = bubbleSort(array);
    return {
      sortedArray: sortedArray
    };
  } catch (error) {
    // Handle any unexpected errors
    reply.status(500).send({
      error: 'An error occurred while sorting the array.'
    });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running at http://127.0.0.1:${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();