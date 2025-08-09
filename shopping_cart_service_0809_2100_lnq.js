// 代码生成时间: 2025-08-09 21:00:26
const fastify = require('fastify')({ logger: true });

// 假设的商品库存数据
const products = {
  "1": { id: 1, name: "Product A", price: 10, stock: 5 },
  "2": { id: 2, name: "Product B", price: 20, stock: 3 },
  "3": { id: 3, name: "Product C", price: 30, stock: 2 },
};

// 购物车数据结构
let cart = [];

// 添加商品到购物车
const addToCart = (productId) => {
  const product = products[productId];
  if (!product) {
    throw new Error('Product not found');
  }
  if (product.stock === 0) {
    throw new Error('Product out of stock');
  }
  // 查找购物车中是否已有该商品
  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  product.stock--;
};

// 获取购物车内容
const getCart = () => {
  return cart;
};

// 清空购物车
const clearCart = () => {
  cart = [];
};

// Fastify路由
fastify.post('/add-to-cart/:productId', async (request, reply) => {
  const { productId } = request.params;
  try {
    addToCart(productId);
    reply.send({
      message: 'Product added to cart successfully',
      cart: getCart(),
    });
  } catch (error) {
    reply.status(400).send({ error: error.message });
  }
});

fastify.get('/cart', async (request, reply) => {
  reply.send({ cart: getCart() });
});

fastify.delete('/cart', async (request, reply) => {
  clearCart();
  reply.send({ message: 'Cart cleared successfully' });
});

// 启动Fastify服务器
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

module.exports = { addToCart, getCart, clearCart };

/*
 * 文件说明：购物车服务的Fastify实现
 * 包含添加商品到购物车、获取购物车内容、清空购物车的功能
 * 每个功能都包含错误处理，确保服务的健壮性
 * 提供了基础的商品库存和购物车数据结构，方便扩展和维护
 */
