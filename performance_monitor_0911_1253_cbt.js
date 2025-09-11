// 代码生成时间: 2025-09-11 12:53:06
const fastify = require('fastify')({ logger: true });

// 引入os模块来获取系统性能信息
const os = require('os');

// 注册一个GET路由，用于获取系统性能数据
fastify.get('/performance', async (request, reply) => {
  try {
    // 获取CPU信息
    const cpuInfo = {
      model: os.cpus()[0].model,
      speed: os.cpus()[0].speed,
      times: os.cpus()[0].times,
      usage: os.cpus().length > 0 ? os.loadavg()[0].toFixed(2) : 0
    };

    // 获取内存信息
    const memInfo = {
      total: os.totalmem(),
      free: os.freemem()
    };

    // 将CPU和内存信息合并成一个响应对象
    const response = {
      cpu: cpuInfo,
      memory: memInfo
    };

    // 返回系统性能数据
    return response;
  } catch (error) {
    // 错误处理
    reply.send(new Error('Failed to fetch system performance data'));
  }
});

// 监听端口，并启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// 调用启动函数
start();

// 设置关闭钩子，以确保服务器优雅关闭
process.on('SIGINT', () => {
  fastify.close().then(() => {
    process.log.info('Server closed successfully');
    process.exit(0);
  });
});

/*
 * 注释说明：
 * 这个程序使用了FASTIFY框架来创建一个简单的服务器，
 * 提供了一个API端点'/performance'，用于获取系统性能数据。
 * 它获取CPU型号、速度、使用情况和内存使用情况，并将这些信息以JSON格式返回。
 * 程序还包含了错误处理和优雅关闭服务器的逻辑。
 */