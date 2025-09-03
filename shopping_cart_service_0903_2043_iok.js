// 代码生成时间: 2025-09-03 20:43:22
const fastify = require('fastify')({ logger: true });

// 模拟数据库中的购物车数据
let cart = [];

/**
 * 添加商品到购物车
 * @param {object} request - Fastify request object
 * @param {object} reply - Fastify reply object
 */
const addToCart = async (request, reply) => {
  const { productId, quantity } = request.body;
  if (typeof productId !== 'number' || typeof quantity !== 'number') {
    reply.status(400).send({ error: 'Invalid input' });
    return;
  }
  
  // 查找商品是否已在购物车中
  const existingItemIndex = cart.findIndex(item => item.productId === productId);
  if (existingItemIndex > -1) {
    // 如果商品已存在，更新数量
    cart[existingItemIndex].quantity += quantity;
  } else {
    // 如果商品不存在，添加新商品
    cart.push({ productId, quantity });
  }
  
  reply.send({ message: 'Product added to cart', cart });
};

/**
 * 从购物车中移除商品
 * @param {object} request - Fastify request object
 * @param {object} reply - Fastify reply object
 */
const removeFromCart = async (request, reply) => {
  const { productId } = request.params;
  if (typeof productId !== 'number') {
    reply.status(400).send({ error: 'Invalid input' });
    return;
  }
  
  const index = cart.findIndex(item => item.productId === productId);
  if (index > -1) {
    cart.splice(index, 1);
    reply.send({ message: 'Product removed from cart', cart });
  } else {
    reply.status(404).send({ error: 'Product not found in cart' });
  }
};

/**
 * 获取购物车中所有商品
 * @param {object} request - Fastify request object
 * @param {object} reply - Fastify reply object
 */
const getCart = async (request, reply) => {
  reply.send({ cart });
};

// 定义路由
fastify.post('/add-to-cart', addToCart);
fastify.delete('/remove-from-cart/:productId', removeFromCart);
fastify.get('/cart', getCart);

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();