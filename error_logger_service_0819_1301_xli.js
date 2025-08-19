// 代码生成时间: 2025-08-19 13:01:58
const fastify = require('fastify')({ logger: true });

// 定义错误日志收集器
class ErrorLogger {
  constructor() {
    this.errorLog = [];
  }

  // 添加错误日志
  logError(error) {
    this.errorLog.push(error);
  }

  // 获取所有错误日志
  getErrorLog() {
    return this.errorLog;
  }
}

// 实例化错误日志收集器
const errorLogger = new ErrorLogger();

// 定义错误处理中间件
fastify.setErrorHandler((error, request, reply) => {
  // 将错误日志添加到收集器中
  errorLogger.logError(error);
  // 响应错误信息给客户端
  reply.status(error.statusCode).send({
    error: error.message,
  });
});

// 定义路由处理函数
fastify.get('/', async (request, reply) => {
  try {
    // 模拟可能发生的错误
    throw new Error('Something went wrong!');
  } catch (error) {
    // 错误处理中间件会捕获此错误
  }
});

// 启动服务
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info('Server is running on http://127.0.0.1:3000');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();

// 提供一个路由来获取所有错误日志
fastify.get('/error-log', async (request, reply) => {
  return errorLogger.getErrorLog();
});

module.exports = fastify;