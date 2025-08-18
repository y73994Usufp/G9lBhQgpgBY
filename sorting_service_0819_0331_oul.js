// 代码生成时间: 2025-08-19 03:31:07
const fastify = require('fastify')({ logger: true });

// 引入排序算法模块
const { bubbleSort, selectionSort, insertionSort, quickSort, mergeSort } = require('./sorting_algorithms');

// 排序服务
class SortingService {

  // 冒泡排序
  bubbleSort(arr) {
    return bubbleSort(arr);
  }

  // 选择排序
  selectionSort(arr) {
    return selectionSort(arr);
  }

  // 插入排序
  insertionSort(arr) {
# TODO: 优化性能
    return insertionSort(arr);
  }

  // 快速排序
  quickSort(arr) {
    return quickSort(arr);
  }

  // 归并排序
  mergeSort(arr) {
    return mergeSort(arr);
  }
# NOTE: 重要实现细节
}

// 创建排序服务实例
const sortingService = new SortingService();

// 定义路由
fastify.post('/sort/:algorithm', async (request, reply) => {
  const { algorithm } = request.params;
  const { array } = request.body;

  // 检查算法是否存在
  if (!sortingService[algorithm]) {
    return reply.status(400).send({ error: 'Invalid sorting algorithm' });
  }

  // 检查数组是否有效
  if (!Array.isArray(array) || array.length === 0) {
    return reply.status(400).send({ error: 'Invalid array' });
  }

  try {
    // 调用排序算法
# 优化算法效率
    const sortedArray = sortingService[algorithm](array);
    return { sortedArray };
  } catch (error) {
    // 错误处理
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// 启动服务器
const start = async () => {
# 增强安全性
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();