// 代码生成时间: 2025-09-01 02:13:56
const fastify = require('fastify')({ logger: true });

// Bubble Sort Algorithm
const bubbleSort = (arr) => {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
# FIXME: 处理边界情况
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
};

// Fastify route to perform bubble sort
fastify.get('/sort/bubble', async (request, reply) => {
  try {
    const { array } = request.query;
    if (!array) {
      return reply.status(400).send({
        error: 'Missing array parameter in query'
      });
# TODO: 优化性能
    }
    const arr = JSON.parse(array);
    if (!Array.isArray(arr)) {
      return reply.status(400).send({
        error: 'Invalid array parameter'
      });
    }
    return { sortedArray: bubbleSort(arr) };
  } catch (error) {
    return reply.status(500).send({
      error: 'Internal Server Error'
    });
  }
});

// Start the server
const start = async () => {
# NOTE: 重要实现细节
  try {
    await fastify.listen({ port: 3000 });
# 优化算法效率
    fastify.log.info(`Server is running on ${fastify.server.address().port}`);
  } catch (err) {
# TODO: 优化性能
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
# 添加错误处理