// 代码生成时间: 2025-08-11 13:25:27
const fastify = require('fastify')({ logger: true });

// 数据统计分析器
class DataAnalysisService {

  // 构造函数，接收数据源
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  // 计算平均值
  calculateMean() {
    let sum = 0;
    for (const value of this.dataSource) {
      sum += value;
    }
    return sum / this.dataSource.length;
  }

  // 计算中位数
  calculateMedian() {
    const sortedData = [...this.dataSource].sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
      return (sortedData[middleIndex - 1] + sortedData[middleIndex]) / 2;
    } else {
      return sortedData[middleIndex];
    }
  }

  // 计算众数
  calculateMode() {
    const frequencyMap = this.dataSource.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    const maxCount = Math.max(...Object.values(frequencyMap));
    return Object.keys(frequencyMap).filter(key => frequencyMap[key] === maxCount);
  }

  // 计算标准差
  calculateStandardDeviation() {
    const mean = this.calculateMean();
    const variance = this.dataSource.reduce((acc, val) => {
      return acc + (val - mean) ** 2;
    }, 0) / this.dataSource.length;
    return Math.sqrt(variance);
  }
}

// 创建数据源
const dataSource = [1, 2, 3, 4, 5];

// 创建数据服务实例
const dataAnalysisService = new DataAnalysisService(dataSource);

// 定义Fastify路由
fastify.get('/mean', async (request, reply) => {
  try {
    const mean = dataAnalysisService.calculateMean();
    reply.send({ mean });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

fastify.get('/median', async (request, reply) => {
  try {
    const median = dataAnalysisService.calculateMedian();
    reply.send({ median });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

fastify.get('/mode', async (request, reply) => {
  try {
    const mode = dataAnalysisService.calculateMode();
    reply.send({ mode });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

fastify.get('/deviation', async (request, reply) => {
  try {
    const standardDeviation = dataAnalysisService.calculateStandardDeviation();
    reply.send({ standardDeviation });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

// 启动Fastify服务器
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