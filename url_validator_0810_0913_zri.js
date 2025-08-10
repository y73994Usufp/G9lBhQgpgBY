// 代码生成时间: 2025-08-10 09:13:48
const Fastify = require('fastify');
const { URL } = require('url');

// 创建Fastify实例
const fastify = Fastify({ logger: true });

// 定义一个异步函数，用于验证URL是否有效
async function validateURL(url) {
  try {
    // 尝试解析URL
    new URL(url);
    return true;
  } catch (error) {
    // 如果解析失败，则返回false
    return false;
  }
}

// 设置路由，用于接收URL进行验证
fastify.get('/validate-url', async (request, reply) => {
  const { url } = request.query;
  // 检查是否提供了URL参数
  if (!url) {
    reply.code(400).send({
      error: 'Missing URL parameter'
    });
    return;
  }
  // 调用validateURL函数验证URL
  const isValid = await validateURL(url);
  // 返回验证结果
  reply.send({
    isValid: isValid,
    message: isValid ? 'URL is valid' : 'URL is invalid'
  });
});

// 启动服务器监听端口3000
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info('Server is running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();