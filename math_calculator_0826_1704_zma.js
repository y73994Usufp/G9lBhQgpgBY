// 代码生成时间: 2025-08-26 17:04:59
const fastify = require('fastify')({ logger: true });

// 定义数学计算工具集的路由和函数
const mathRoutes = (fastify, options) => {
  // 加法函数
  fastify.get('/add', async (request, reply) => {
    const { a, b } = request.query;
    if (isNaN(a) || isNaN(b)) {
      return reply.status(400).send({ error: 'Invalid input' });
    }
    return { sum: Number(a) + Number(b) };
  });

  // 减法函数
  fastify.get('/subtract', async (request, reply) => {
    const { a, b } = request.query;
    if (isNaN(a) || isNaN(b)) {
      return reply.status(400).send({ error: 'Invalid input' });
    }
    return { difference: Number(a) - Number(b) };
  });

  // 乘法函数
  fastify.get('/multiply', async (request, reply) => {
    const { a, b } = request.query;
    if (isNaN(a) || isNaN(b)) {
      return reply.status(400).send({ error: 'Invalid input' });
    }
    return { product: Number(a) * Number(b) };
  });

  // 除法函数
  fastify.get('/divide', async (request, reply) => {
    const { a, b } = request.query;
    if (isNaN(a) || isNaN(b)) {
      return reply.status(400).send({ error: 'Invalid input' });
    }
    if (Number(b) === 0) {
      return reply.status(400).send({ error: 'Cannot divide by zero' });
    }
    return { quotient: Number(a) / Number(b) };
  });
};

// 注册数学计算工具集路由
fastify.register(mathRoutes);

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