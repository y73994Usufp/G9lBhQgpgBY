// 代码生成时间: 2025-08-22 01:06:11
const fastify = require('fastify')({ logger: true });

// 随机数生成器函数
async function generateRandomNumber(min, max) {
  // 确保输入是有效的
  if (min > max) {
    throw new Error('Minimum cannot be greater than maximum');
  }

  // 生成一个介于min和max之间的随机整数
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 定义路由和处理函数
fastify.get('/random-number', async (request, reply) => {
  // 获取请求参数
  const { min, max } = request.query;

  // 检查参数是否有效
  if (min === undefined || max === undefined || isNaN(min) || isNaN(max)) {
    reply.code(400);
    return { error: 'Missing or invalid parameters' };
  }

  try {
    // 调用随机数生成器
    const randomNumber = await generateRandomNumber(min, max);

    // 返回生成的随机数
    return { randomNumber };
  } catch (error) {
    // 错误处理
    reply.code(500);
    return { error: error.message };
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();