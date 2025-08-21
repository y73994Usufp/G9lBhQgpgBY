// 代码生成时间: 2025-08-21 08:06:13
const Fastify = require('fastify');
const fs = require('fs');
const path = require('path');

// 创建Fastify实例
const fastify = Fastify({ logger: true });

// 配置文件管理器类
class ConfigManager {
  constructor() {
    this.configs = {};
  }

  // 加载配置文件
  loadConfig(filePath) {
    try {
      const config = require(filePath);
      this.configs[filePath] = config;
      return config;
    } catch (error) {
      throw new Error(`Failed to load config from ${filePath}: ${error.message}`);
    }
  }

  // 获取配置
  getConfig(filePath) {
    const config = this.configs[filePath];
    if (!config) {
      throw new Error(`Config not found for ${filePath}`);
    }
    return config;
  }
}

// 实例化配置管理器
const configManager = new ConfigManager();

// 路由：加载配置文件
fastify.get('/load-config/:configPath', async (request, reply) => {
  try {
    const { configPath } = request.params;
    const config = configManager.loadConfig(configPath);
    reply.send({
      message: 'Config loaded successfully',
      config
    });
  } catch (error) {
    reply.status(500).send({
      message: 'Failed to load config',
      error: error.message
    });
  }
});

// 路由：获取配置
fastify.get('/get-config/:configPath', async (request, reply) => {
  try {
    const { configPath } = request.params;
    const config = configManager.getConfig(configPath);
    reply.send({
      message: 'Config retrieved successfully',
      config
    });
  } catch (error) {
    reply.status(500).send({
      message: 'Failed to retrieve config',
      error: error.message
    });
  }
});

// 启动Fastify服务器
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Server is running on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();