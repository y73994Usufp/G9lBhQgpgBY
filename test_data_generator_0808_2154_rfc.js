// 代码生成时间: 2025-08-08 21:54:34
const fastify = require('fastify')({ logger: true });

// 测试数据生成器路由
fastify.get('/test-data/:count', async (request, reply) => {
  const count = request.params.count;
  try {
    // 确保输入是一个正整数
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error('Invalid count parameter');
    }

    // 生成测试数据
    const testData = Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `Test User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      dateOfBirth: new Date(Date.now() - (index + 1) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));

    return {
      success: true,
      data: testData
    };
  } catch (error) {
    // 错误处理
    reply.status(400).send({
      success: false,
      message: error.message
    });
  }
});

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