// 代码生成时间: 2025-08-08 03:09:32
const fastify = require('fastify')({ logger: true });

// 定义一个函数来生成随机数
function generateRandomNumber(min, max) {
  if (min > max) {
    throw new Error('Min cannot be greater than max');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 定义路由处理函数
const randomNumberHandler = async (request, reply) => {
  const { min, max } = request.query;
  try {
    // 验证输入参数
    if (!Number.isInteger(+min) || !Number.isInteger(+max)) {
      throw new Error('Min and Max must be integers');
    }
    const randomNumber = generateRandomNumber(+min, +max);
    return { randomNumber };
  } catch (error) {
    // 错误处理
    return reply.status(400).send({ error: error.message });
  }
};

// 注册路由
fastify.get('/random-number', randomNumberHandler);

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

// 导出fastify实例，以便在测试或其他场合使用
module.exports = fastify;