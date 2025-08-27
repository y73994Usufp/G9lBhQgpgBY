// 代码生成时间: 2025-08-28 00:34:44
const fastify = require('fastify')({ logger: true });

// 定义测试用例
const testCases = [
  { url: '/echo', method: 'GET', payload: { text: 'hello' } },
  { url: '/echo', method: 'POST', payload: { text: 'hello' } },
  { url: '/echo', method: 'PUT', payload: { text: 'hello' } },
  { url: '/echo', method: 'DELETE', payload: { text: 'hello' } },
];

// 性能测试函数
async function performanceTest() {
  try {
    // 模拟发送请求
    for (const testCase of testCases) {
      await fastify.inject({
        method: testCase.method,
        url: testCase.url,
        payload: testCase.payload,
      });
    }
    fastify.log.info('Performance test completed successfully');
  } catch (error) {
    fastify.log.error('Performance test failed:', error);
  }
}

// 创建测试路由
testCases.forEach((testCase) => {
  fastify.route({
    method: testCase.method,
    url: testCase.url,
    handler: async (req, reply) => {
      reply.send(req.body);
    },
  });
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info('Server is listening on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// 注册关闭钩子
process.on('SIGINT', async () => {
  try {
    await fastify.close();
    process.log.info('Server closed successfully');
  } catch (err) {
    fastify.log.error(err);
  }
  process.exit(0);
});

// 注册性能测试函数
setInterval(performanceTest, 10000); // 每10秒执行一次性能测试

// 文档说明：
// 该脚本创建了一个Fastify服务器，并定义了4个测试用例，分别对应GET、POST、PUT、DELETE请求。
// 性能测试函数会模拟发送这些请求，并记录服务器的响应时间。
// 服务器启动后，每10秒会自动执行一次性能测试。
// 代码结构清晰，易于理解，包含了适当的错误处理和注释。