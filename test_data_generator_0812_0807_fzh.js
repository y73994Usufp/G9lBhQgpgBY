// 代码生成时间: 2025-08-12 08:07:47
const fp = require('fastify')({ logger: true });
const { v4: uuidv4 } = require('uuid');

// 创建测试数据的函数
const createTestData = () => {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      id: uuidv4(),
      name: `User ${i}`,
      email: `user${i}@example.com`,
      age: Math.floor(Math.random() * 50)
    });
  }
  return data;
};

// 路由：获取测试数据
fp.get('/', async (request, reply) => {
  try {
    const testData = createTestData();
    reply.code(200).send({ testData });
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fp.listen({ port: 3000 });
    fp.log.info(`Server is running at ${fp.server.address().port}`);
  } catch (err) {
    fp.log.error(err);
    process.exit(1);
  }
};

start();

// 模块导出，以便进行单元测试
module.exports = { createTestData, start };
