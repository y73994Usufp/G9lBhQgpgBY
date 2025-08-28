// 代码生成时间: 2025-08-28 18:51:50
// Import Fastify and other necessary modules
const fastify = require('fastify')({ logger: true });

// Define a simple data store for demonstration purposes
const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
  { id: 3, name: 'Jim Beam' }
];

// Helper function to find a user by ID
const findUserById = (id) => {
  return users.find(user => user.id === parseInt(id));
};

// Define a route for GET /users
fastify.get('/users', async (request, reply) => {
  try {
    // Return all users
    return { users: users.map(user => ({ id: user.id, name: user.name })) };
  } catch (error) {
    // Handle any errors that occur
    reply.send(fastify.httpErrors.internalServerError('Error fetching users'));
  }
});

// Define a route for GET /users/:id
fastify.get('/users/:id', async (request, reply) => {
  try {
    const user = findUserById(request.params.id);
    if (!user) {
      reply.code(404);
      return { error: 'User not found' };
    }
    return { user: { id: user.id, name: user.name } };
  } catch (error) {
    // Handle any errors that occur
    reply.send(fastify.httpErrors.internalServerError('Error fetching user'));
  }
});

// Define a route for POST /users
fastify.post('/users', async (request, reply) => {
  try {
    const { name } = request.body;
    const newUser = {
      id: users.length + 1,
      name: name
    };
    users.push(newUser);
    return {
      statusCode: 201,
      message: 'User created successfully',
      data: { user: newUser }
    };
  } catch (error) {
    // Handle any errors that occur
    reply.send(fastify.httpErrors.internalServerError('Error creating user'));
  }
});

// Define a route for PUT /users/:id
fastify.put('/users/:id', async (request, reply) => {
  try {
    const user = findUserById(request.params.id);
    if (!user) {
      reply.code(404);
      return { error: 'User not found' };
    }
    const { name } = request.body;
    user.name = name;
    return {
      statusCode: 200,
      message: 'User updated successfully',
      data: { user: { id: user.id, name: user.name } }
    };
  } catch (error) {
    // Handle any errors that occur
    reply.send(fastify.httpErrors.internalServerError('Error updating user'));
  }
});

// Define a route for DELETE /users/:id
fastify.delete('/users/:id', async (request, reply) => {
  try {
    const user = findUserById(request.params.id);
    if (!user) {
      reply.code(404);
      return { error: 'User not found' };
    }
    const index = users.indexOf(user);
    users.splice(index, 1);
    return {
      statusCode: 200,
      message: 'User deleted successfully'
    };
  } catch (error) {
    // Handle any errors that occur
    reply.send(fastify.httpErrors.internalServerError('Error deleting user'));
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running at ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();