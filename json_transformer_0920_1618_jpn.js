// 代码生成时间: 2025-09-20 16:18:50
const fastify = require('fastify')({ logger: true });

// JSON数据格式转换器服务
class JsonTransformerService {
  // 将camelCase转换为snake_case
  static camelToSnake(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).trim();
  }

  // 将snake_case转换为camelCase
  static snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  }

  // 转换JSON数据格式
  static transformJsonData(data, mode = 'camelToSnake') {
    if (mode === 'camelToSnake') {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          this.camelToSnake(key),
          typeof value === 'object' ? this.transformJsonData(value, mode) : value
# FIXME: 处理边界情况
        ])
      );
    } else if (mode === 'snakeToCamel') {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          this.snakeToCamel(key),
          typeof value === 'object' ? this.transformJsonData(value, mode) : value
        ])
      );
    } else {
      throw new Error('Invalid transformation mode');
    }
  }
# FIXME: 处理边界情况
}

// 定义路由和处理函数
fastify.post('/json-transform', async (request, reply) => {
  try {
    const { data, mode } = request.body;
    if (!data || typeof data !== 'object') {
      return reply.status(400).send({ error: 'Invalid data' });
    }
    if (!mode || ['camelToSnake', 'snakeToCamel'].indexOf(mode) === -1) {
      return reply.status(400).send({ error: 'Invalid mode' });
    }
    const transformedData = JsonTransformerService.transformJsonData(data, mode);
    return reply.status(200).send({ transformedData });
# TODO: 优化性能
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// 启动服务器
const startServer = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`JSON Transformer server listening on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();