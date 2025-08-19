// 代码生成时间: 2025-08-19 08:41:31
const Fastify = require('fastify');
const fs = require('fs');
const path = require('path');

// 配置文件管理器
class ConfigManager {
  constructor(configPath) {
    this.configPath = configPath;
  }

  // 读取配置文件
  readConfig() {
    try {
      const configFile = path.join(this.configPath, 'config.json');
      const data = fs.readFileSync(configFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Failed to read configuration file: ' + error.message);
    }
  }

  // 写入配置文件
  writeConfig(configData) {
    try {
      const configFile = path.join(this.configPath, 'config.json');
      fs.writeFileSync(configFile, JSON.stringify(configData, null, 2), 'utf8');
    } catch (error) {
      throw new Error('Failed to write configuration file: ' + error.message);
    }
  }
}

// 创建Fastify实例
const fastify = Fastify();

// 配置文件路径
const configPath = './config';

// 创建配置文件管理器实例
const configManager = new ConfigManager(configPath);

// 读取配置文件
fastify.get('/read-config', async (request, reply) => {
  try {
    const config = configManager.readConfig();
    reply.send(config);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

// 写入配置文件
fastify.post('/write-config', async (request, reply) => {
  try {
    const { configData } = request.body;
    configManager.writeConfig(configData);
    reply.send({ message: 'Configuration written successfully' });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
});

// 启动Fastify服务器
const start = async () => {
  try {
    await fastify.listen(3000);
    console.log('Server is running on port 3000');
  } catch (error) {
    console.error('Error starting server: ' + error.message);
  }
};

start();