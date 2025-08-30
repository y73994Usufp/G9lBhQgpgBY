// 代码生成时间: 2025-08-31 06:00:40
const Fastify = require('fastify');
const crypto = require('crypto');

// 创建 Fastify 实例
const app = Fastify({ logger: true });

// 定义计算哈希值的函数
function calculateHash(data, algorithm) {
  // 使用 crypto 模块计算哈希值
  return crypto.createHash(algorithm).update(data).digest('hex');
}

// 定义一个 POST 路由，用于计算哈希值
app.post('/hash', async (request, reply) => {
  // 从请求体中获取数据和算法类型
  const { data, algorithm } = request.body;

  // 检查数据和算法是否提供
  if (!data || !algorithm) {
    reply.code(400).send({ error: 'Data and algorithm are required' });
    return;
  }

  try {
    // 调用 calculateHash 函数并返回结果
    const hash = calculateHash(data, algorithm);
    reply.send({ hash });
  } catch (error) {
    // 错误处理
    reply.code(500).send({ error: `Failed to calculate hash: ${error.message}` });
  }
});

// 启动服务器
const start = async () => {
  try {
    await app.listen({ port: 3000 });
    app.log.info(`Server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();