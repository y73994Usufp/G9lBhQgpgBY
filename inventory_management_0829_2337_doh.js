// 代码生成时间: 2025-08-29 23:37:48
const fastify = require('fastify')({ logger: true });

// 模拟的库存数据
const inventory = {
  'item1': { id: 'item1', name: 'Laptop', quantity: 10 },
  'item2': { id: 'item2', name: 'Smartphone', quantity: 20 },
  'item3': { id: 'item3', name: 'Tablet', quantity: 15 }
};

// 获取库存列表
fastify.get('/inventory', async (request, reply) => {
  try {
    reply.send(Object.values(inventory));
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

// 获取单个库存项
fastify.get('/inventory/:itemId', async (request, reply) => {
  const { itemId } = request.params;
  try {
    const item = inventory[itemId];
    if (!item) {
      return reply.status(404).send({ error: 'Item not found' });
    }
    reply.send(item);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

// 更新库存数量
fastify.put('/inventory/:itemId', async (request, reply) => {
  const { itemId } = request.params;
  const { quantity } = request.body;
  try {
    const item = inventory[itemId];
    if (!item) {
      return reply.status(404).send({ error: 'Item not found' });
    }
    if (quantity < 0) {
      return reply.status(400).send({ error: 'Quantity cannot be negative' });
    }
    item.quantity = quantity;
    reply.send({ message: 'Inventory updated successfully', updatedItem: item });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

// 启动服务器
const startServer = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running on ${fastify.server.address().port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

startServer();