// 代码生成时间: 2025-07-31 19:40:39
const fastify = require('fastify')({ logger: true });

// 假设存储购物车数据的简单存储
const cartStorage = {
  carts: {}
};

// 购物车ID生成器
let cartIdCounter = 1;

// 创建购物车
fastify.post('/cart', async (request, reply) => {
  const { cartId } = request.body;
  if (cartId) {
    cartStorage.carts[cartId] = [];
  } else {
    cartId = cartIdCounter++;
    cartStorage.carts[cartId] = [];
  }
  return { cartId: cartId, message: 'Cart created successfully' };
});

// 添加商品到购物车
fastify.post('/cart/:cartId/items', async (request, reply) => {
  const { cartId } = request.params;
  const { itemId, quantity } = request.body;
  if (!cartStorage.carts[cartId]) {
    reply.status(404).send({ error: 'Cart not found' });
    return;
  }
  cartStorage.carts[cartId].push({ itemId, quantity });
  return { message: 'Item added to cart', cartId: cartId };
});

// 获取购物车内容
fastify.get('/cart/:cartId', async (request, reply) => {
  const { cartId } = request.params;
  if (!cartStorage.carts[cartId]) {
    reply.status(404).send({ error: 'Cart not found' });
    return;
  }
  return { cartId: cartId, items: cartStorage.carts[cartId] };
});

// 删除购物车
fastify.delete('/cart/:cartId', async (request, reply) => {
  const { cartId } = request.params;
  if (cartStorage.carts[cartId]) {
    delete cartStorage.carts[cartId];
    return { message: 'Cart deleted successfully', cartId: cartId };
  }
  reply.status(404).send({ error: 'Cart not found' });
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