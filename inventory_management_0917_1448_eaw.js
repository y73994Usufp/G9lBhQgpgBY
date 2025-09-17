// 代码生成时间: 2025-09-17 14:48:01
const fastify = require('fastify')({ logger: true });

// 模拟库存数据
const inventory = {
  items: [
    { id: 1, name: 'Laptop', quantity: 10 },
    { id: 2, name: 'Mouse', quantity: 20 },
    { id: 3, name: 'Keyboard', quantity: 15 }
  ]
};

// 获取所有库存项
fastify.get('/inventory', async (request, reply) => {
  try {
    return {
      status: 'success',
      data: inventory.items
    };
  } catch (error) {
    reply.code(500);
    return {
      status: 'error',
      message: `Internal server error: ${error.message}`
    };
  }
});

// 获取单个库存项
fastify.get('/inventory/:id', async (request, reply) => {
  const { id } = request.params;
  const item = inventory.items.find(i => i.id.toString() === id);
  if (!item) {
    reply.code(404);
    return {
      status: 'error',
      message: 'Item not found'
    };
  }
  try {
    return {
      status: 'success',
      data: item
    };
  } catch (error) {
    reply.code(500);
    return {
      status: 'error',
      message: `Internal server error: ${error.message}`
    };
  }
});

// 添加库存项
fastify.post('/inventory', async (request, reply) => {
  try {
    const { name, quantity } = request.body;
    if (!name || !quantity) {
      reply.code(400);
      return {
        status: 'error',
        message: 'Name and quantity are required'
      };
    }
    const newItem = { id: inventory.items.length + 1, name, quantity };
    inventory.items.push(newItem);
    return {
      status: 'success',
      data: newItem
    };
  } catch (error) {
    reply.code(500);
    return {
      status: 'error',
      message: `Internal server error: ${error.message}`
    };
  }
});

// 更新库存项
fastify.put('/inventory/:id', async (request, reply) => {
  const { id } = request.params;
  const { name, quantity } = request.body;
  const item = inventory.items.find(i => i.id.toString() === id);
  if (!item) {
    reply.code(404);
    return {
      status: 'error',
      message: 'Item not found'
    };
  }
  try {
    item.name = name;
    item.quantity = quantity;
    return {
      status: 'success',
      data: item
    };
  } catch (error) {
    reply.code(500);
    return {
      status: 'error',
      message: `Internal server error: ${error.message}`
    };
  }
});

// 删除库存项
fastify.delete('/inventory/:id', async (request, reply) => {
  const { id } = request.params;
  const itemIndex = inventory.items.findIndex(i => i.id.toString() === id);
  if (itemIndex === -1) {
    reply.code(404);
    return {
      status: 'error',
      message: 'Item not found'
    };
  }
  try {
    inventory.items.splice(itemIndex, 1);
    return {
      status: 'success',
      message: 'Item deleted successfully'
    };
  } catch (error) {
    reply.code(500);
    return {
      status: 'error',
      message: `Internal server error: ${error.message}`
    };
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Server is running on port ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();