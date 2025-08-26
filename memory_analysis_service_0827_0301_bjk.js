// 代码生成时间: 2025-08-27 03:01:24
const fastify = require('fastify')({ logger: true });

// 引入process.memoryUsage来获取内存使用情况
const { memoryUsage } = process;

// 定义一个接口，用于获取当前进程的内存使用情况
fastify.get('/', async (request, reply) => {
  try {
    // 获取内存使用数据
    const memoryData = memoryUsage();
    
    // 将内存使用情况以MB为单位转换
    const memoryUsageInMB = {
      rss: memoryData.rss / 1024 / 1024, // Resident Set Size
      heapTotal: memoryData.heapTotal / 1024 / 1024, // Total heap
      heapUsed: memoryData.heapUsed / 1024 / 1024 // Used heap
    };
    
    // 返回内存使用情况
    reply.send(memoryUsageInMB);
  } catch (error) {
    // 错误处理
    reply.status(500).send({ error: error.message });
  }
});

// 监听端口启动服务
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// 导出启动函数
module.exports = { start };

// 运行代码
if (require.main === module) {
  start();
}