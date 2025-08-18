// 代码生成时间: 2025-08-18 16:07:45
const fs = require('fs');
const path = require('path');
const fastify = require('fastify')({ logger: { level: 'info' } });

// 配置文件路径
const configFilePath = path.join(__dirname, 'config.json');

// 读取配置文件的函数
async function readConfig() {
  try {
    // 确保配置文件存在
    if (!fs.existsSync(configFilePath)) {
      throw new Error('配置文件不存在');
    }
    const data = await fs.promises.readFile(configFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`读取配置文件失败: ${error.message}`);
  }
}

// 更新配置文件的函数
async function updateConfig(newConfig) {
  try {
    const serializedConfig = JSON.stringify(newConfig, null, 2);
    await fs.promises.writeFile(configFilePath, serializedConfig);
  } catch (error) {
    throw new Error(`更新配置文件失败: ${error.message}`);
  }
}

// 配置文件管理器的路由
fastify.get('/config', async (request, reply) => {
  try {
    const config = await readConfig();
    reply.send(config);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

fastify.put('/config', async (request, reply) => {
  try {
    const newConfig = request.body;
    await updateConfig(newConfig);
    reply.send({ message: '配置文件已更新' });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

// 启动Fastify服务器
async function startServer() {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info('服务器启动成功，监听3000端口');
  } catch (error) {
    fastify.log.error(`服务器启动失败: ${error.message}`);
  }
}

// 导出启动函数
module.exports = { startServer };

// 如果是主模块，则启动服务器
if (require.main === module) {
  startServer();
}