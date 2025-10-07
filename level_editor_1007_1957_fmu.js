// 代码生成时间: 2025-10-07 19:57:44
const fastify = require('fastify')({
  logger: true
});

// Define the data structure for a level
const levelData = {
  1: {
    name: 'Easy Level',
    obstacles: ['tree', 'rock'],
    enemies: ['goblin'],
    treasures: ['gold', 'silver']
  },
  2: {
    name: 'Medium Level',
    obstacles: ['river', 'mountain'],
    enemies: ['dragon'],
    treasures: ['diamond', 'ruby']
  }
};

// Route to get a level by id
fastify.get('/level/:id', async (request, reply) => {
  const { id } = request.params;
  const level = levelData[id];
  if (!level) {
    reply.code(404).send({
      error: 'Level not found'
    });
  } else {
    reply.send({
      level: level
    });
  }
});

// Route to update a level
fastify.put('/level/:id', async (request, reply) => {
  const { id } = request.params;
  if (!levelData[id]) {
    reply.code(404).send({
      error: 'Level not found'
    });
  } else {
    const { name, obstacles, enemies, treasures } = request.body;
    if (!name || !obstacles || !enemies || !treasures) {
      reply.code(400).send({
        error: 'Missing required fields'
      });
    } else {
      levelData[id] = {
        name,
        obstacles,
        enemies,
        treasures
      };
      reply.send({
        updatedLevel: levelData[id]
      });
    }
  }
});

// Error handler for 404 Not Found
fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    error: 'Route not found'
  });
});

// Start the server
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Level Editor service listening on port ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();