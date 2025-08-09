// 代码生成时间: 2025-08-09 09:26:58
const fastify = require('fastify')({ logger: true });
const validator = require('validator');

// 定义一个用于验证URL有效性的函数
async function validateUrl(url) {
  // 使用validator库来验证URL是否有效
  if (validator.isURL(url, { require_protocol: true })) {
    return { isValid: true, message: 'URL is valid' };
  } else {
    throw new Error('Invalid URL');
  }
}

// 创建一个路由来处理URL验证请求
fastify.post('/validate-url', async (request, reply) => {
  try {
    // 从请求体中获取URL
    const { url } = request.body;
    
    // 验证URL
    const validationResult = await validateUrl(url);
    
    // 返回验证结果
    return validationResult;
  } catch (error) {
    // 返回错误信息
    reply.status(400).send({ isValid: false, message: error.message });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running at http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// 导出启动函数以便测试
module.exports = { start };

// 运行服务器
if (require.main === module) {
  start();
}
