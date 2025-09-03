// 代码生成时间: 2025-09-04 02:57:47
const Fastify = require('fastify');
const { resolve } = require('path');

// 创建 Fastify 实例
const app = Fastify({
  logger: true,
});

// 配置文件管理器路由
app.get('/config/:configFile', async (request, reply) => {
  // 从请求中获取配置文件名
  const { configFile } = request.params;
  
  // 尝试读取配置文件
  try {
    const configPath = resolve(__dirname, 'configs', `${configFile}.json`);
    const configContent = await app.readFileSync(configPath);
    
    // 返回配置文件内容
    return {
      config: configContent
    };
  } catch (error) {
    // 错误处理
    if (error.code === 'ENOENT') {
      reply.code(404).send({
        error: 'Config file not found'
      });
    } else {
      reply.send(error);
    }
  }
});

// 启动服务器
const start = async () => {
  try {
    await app.listen({ port: 3000 });
    app.log.info(`Server is running at http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();