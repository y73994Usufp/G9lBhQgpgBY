// 代码生成时间: 2025-10-10 17:22:58
const Fastify = require('fastify');

// 创建 Fastify 实例
const fastify = Fastify({ logger: true });

// 定义标签页数据
const tabs = {
  home: {
    title: "Home",
    content: "Welcome to the home tab."
  },
  about: {
    title: "About",
    content: "This is the about tab."
  },
  contact: {
    title: "Contact",
    content: "Get in touch with us through the contact tab."
  }
};

// 获取标签页信息的路由
fastify.get('/tab/:tabName', async (request, reply) => {
  const { tabName } = request.params;
  // 检查标签页是否存在
  if (!tabs[tabName]) {
    return reply.status(404).send({ error: 'Tab not found' });
  }
  // 返回标签页信息
  return tabs[tabName];
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

// 注释和文档
/*
 * Tab Switcher Service
 *
 * This service provides a simple API to switch between different tabs.
 * Each tab has a title and content.
 * The API endpoint allows retrieval of tab information based on the tab name.
 *
 * Endpoint:
 * GET /tab/:tabName - Retrieve information about the specified tab.
 */