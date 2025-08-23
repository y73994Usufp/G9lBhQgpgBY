// 代码生成时间: 2025-08-23 19:36:54
const fastify = require('fastify')({ logger: true });
const crypto = require('crypto');

// 注册一个GET路由，用于计算哈希值
fastify.get('/calculate-hash', async (request, reply) => {
  // 从请求中获取要计算哈希值的字符串
  const { str } = request.query;

  // 错误处理：如果传入的字符串为空，则返回错误
  if (!str) {
    reply.code(400).send({ error: 'No string provided' });
    return;
  }

  // 计算哈希值，这里以SHA256为例
  const hash = crypto.createHash('sha256').update(str).digest('hex');

  // 返回哈希值
  reply.send({ hash });
});

// 启动Fastify服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// 模块导出，以便可以被其他文件导入和测试
module.exports = {
  fastify,
  start
};