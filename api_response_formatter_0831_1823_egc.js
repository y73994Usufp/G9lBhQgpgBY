// 代码生成时间: 2025-08-31 18:23:33
const fastify = require('fastify')({ logger: true });

// 定义 API 响应格式化工具的 schema
const responseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description: 'Operation success status'
    },
    data: {
      type: 'object',
      description: 'Response data object'
    },
    message: {
      type: 'string',
      description: 'Optional message for the response'
    },
    error: {
      type: 'object',
      description: 'Optional error details'
    }
  },
  required: ['success', 'data']
};

// 格式化响应工具函数
function formatResponse(success, data, message, error) {
  const response = {
    success: success,
    data: data || {}
  };
  if (message) {
    response.message = message;
  }
  if (error) {
    response.error = error;
  }
  return response;
}

// GET 请求处理器，演示响应格式化工具的使用
fastify.get('/', { schema: responseSchema }, async (request, reply) => {
  try {
    // 模拟业务逻辑
    const data = { message: 'Hello World' };
    return formatResponse(true, data);
  } catch (error) {
    // 错误处理
    return formatResponse(false, {}, null, { message: error.message });
  }
});

// 错误处理器
fastify.setErrorHandler((error, request, reply) => {
  // Log the error
  fastify.log.error(error);
  // Format the error response
  reply
    .code(500)
    .send(formatResponse(false, {}, error.message, { message: error.message, code: error.code }));
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