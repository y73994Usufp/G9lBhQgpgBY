// 代码生成时间: 2025-09-16 23:30:53
const fastify = require('fastify')({ logger: true });

// 定义一个示例数据集，用于演示
const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
];

// 获取所有用户接口
fastify.get('/users', async (request, reply) => {
  try {
    // 返回所有用户
    return users;
  } catch (error) {
    // 错误处理
    reply.send(error);
  }
});

// 获取单个用户接口
fastify.get('/users/:id', async (request, reply) => {
  try {
    const userId = request.params.id;
    // 查找用户
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }
    return user;
  } catch (error) {
    // 错误处理
    reply.send(error);
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Server is running at ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();