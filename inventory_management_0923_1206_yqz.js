// 代码生成时间: 2025-09-23 12:06:13
const fastify = require('fastify')({ logger: true });

// 库存模拟数据
const inventory = {
  'item1': { id: 'item1', name: 'Item 1', quantity: 100 },
  'item2': { id: 'item2', name: 'Item 2', quantity: 50 }
};

// 获取所有库存项
fastify.get('/inventory', async (request, reply) => {
  try {
    return {
      status: 'success',
      data: Object.values(inventory)
    };
  } catch (error) {
    reply.status(500).send({
      status: 'error',
      message: 'Failed to retrieve inventory',
      error: error.message
    });
  }
});

// 获取单个库存项
fastify.get('/inventory/:itemId', async (request, reply) => {
  const { itemId } = request.params;
  try {
    const item = inventory[itemId];
    if (!item) {
      reply.status(404).send({
        status: 'error',
        message: 'Item not found'
      });
    } else {
      return {
        status: 'success',
        data: item
      };
    }
  } catch (error) {
    reply.status(500).send({
      status: 'error',
      message: 'Failed to retrieve item',
      error: error.message
    });
  }
});

// 更新库存项
fastify.put('/inventory/:itemId', async (request, reply) => {
  const { itemId } = request.params;
  try {
    const item = inventory[itemId];
    if (!item) {
      reply.status(404).send({
        status: 'error',
        message: 'Item not found'
      });
    } else {
      const { quantity } = request.body;
      if (typeof quantity !== 'number' || quantity < 0) {
        reply.status(400).send({
          status: 'error',
          message: 'Invalid quantity'
        });
      } else {
        inventory[itemId].quantity = quantity;
        return {
          status: 'success',
          message: 'Inventory updated'
        };
      }
    }
  } catch (error) {
    reply.status(500).send({
      status: 'error',
      message: 'Failed to update inventory',
      error: error.message
    });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();