// 代码生成时间: 2025-10-03 16:58:40
const fastify = require('fastify')({ logger: true });

// 标签页数据模型
const tabsData = {
  'home': 'Home Page Content',
  'profile': 'Profile Page Content',
  'settings': 'Settings Page Content'
};

// 获取标签页内容的函数
function getTabContent(tab) {
  if (!tabsData[tab]) {
    throw new Error(`Tab '${tab}' not found`);
  }
  return tabsData[tab];
}

// 路由定义：获取标签页内容
fastify.get('/tabs/:tab', async (request, reply) => {
  try {
    const tab = request.params.tab;
    const content = getTabContent(tab);
    reply.send({
      success: true,
      tab,
      content
    });
  } catch (error) {
    reply.status(404).send({
      success: false,
      message: error.message
    });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// 导出启动函数
module.exports = {
  start
};

// 调用启动函数以启动服务器
start();