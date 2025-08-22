// 代码生成时间: 2025-08-22 10:55:06
// Import Fastify
const fastify = require('fastify')({
  logger: true,
});

// Declare a port for the server
const PORT = process.env.PORT || 3000;

// Declare an array to store items
let items = [];

// POST endpoint to create an item
fastify.post('/api/items', async (request, reply) => {
  // Check if the item data is provided
  if (!request.body.name || !request.body.description) {
    reply.status(400).send({
      error: 'Bad Request',
      message: 'Item name and description are required.',
    });
    return;
  }
  
  // Create a new item
  const newItem = {
    id: Date.now(),
    name: request.body.name,
    description: request.body.description,
  };
  
  // Add the item to the array
  items.push(newItem);
  
  // Return the created item
  reply.status(201).send(newItem);
});

// GET endpoint to retrieve all items
fastify.get('/api/items', async () => {
  // Return the list of items
  return items;
});

// GET endpoint to retrieve a single item by id
fastify.get('/api/items/:id', async (request, reply) => {
  // Find the item by id
  const item = items.find(i => i.id === parseInt(request.params.id));
  
  // If item is not found, return a 404 error
  if (!item) {
    reply.status(404).send({
      error: 'Not Found',
      message: 'Item not found.',
    });
    return;
  }
  
  // Return the item
  return item;
});

// PUT endpoint to update an item
fastify.put('/api/items/:id', async (request, reply) => {
  // Find the item by id
  const item = items.find(i => i.id === parseInt(request.params.id));
  
  // If item is not found, return a 404 error
  if (!item) {
    reply.status(404).send({
      error: 'Not Found',
      message: 'Item not found.',
    });
    return;
  }
  
  // Update the item
  item.name = request.body.name || item.name;
  item.description = request.body.description || item.description;
  
  // Return the updated item
  return item;
});

// DELETE endpoint to delete an item
fastify.delete('/api/items/:id', async (request, reply) => {
  // Find the item index by id
  const index = items.findIndex(i => i.id === parseInt(request.params.id));
  
  // If item is not found, return a 404 error
  if (index === -1) {
    reply.status(404).send({
      error: 'Not Found',
      message: 'Item not found.',
    });
    return;
  }
  
  // Remove the item from the array
  items.splice(index, 1);
  
  // Return a success message
  reply.status(204).send();
});

// Start the server
const start = async () => {
  try {
    await fastify.listen(PORT, '0.0.0.0');
    fastify.log.info(`Server is running on ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Call the start function
start();