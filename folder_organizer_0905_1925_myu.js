// 代码生成时间: 2025-09-05 19:25:49
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');

// 定义一个函数用于整理文件夹结构
async function organizeFolderStructure(folderPath) {
  try {
    // 检查文件夹是否存在
    if (!fs.existsSync(folderPath)) {
      throw new Error('Folder does not exist');
    }

    // 读取文件夹内所有文件和子文件夹
    const items = fs.readdirSync(folderPath, { withFileTypes: true });
    for (const item of items) {
      // 跳过'.'和'..'特殊的目录
      if (item.name === '.' || item.name === '..') {
        continue;
      }
      // 检查是文件还是文件夹
      if (item.isDirectory()) {
        // 如果是文件夹，递归调用整理函数
        await organizeFolderStructure(path.join(folderPath, item.name));
      } else if (item.isFile()) {
        // 这里可以添加文件整理的逻辑，例如按文件类型分类等
        // 例如，将所有'.js'文件移动到'js'子文件夹
        const extension = path.extname(item.name);
        if (extension === '.js') {
          const destFolder = path.join(folderPath, 'js');
          if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder);
          }
          fs.renameSync(path.join(folderPath, item.name), path.join(destFolder, item.name));
        }
      }
    }
  } catch (error) {
    // 错误处理
    console.error('Error organizing folder structure:', error.message);
  }
}

// 创建一个路由处理GET请求，用于触发文件夹整理
fastify.get('/organize', async (request, reply) => {
  try {
    // 从请求中获取文件夹路径
    const folderPath = request.query.path;
    // 调用整理函数
    await organizeFolderStructure(folderPath);
    reply.send({ message: 'Folder structure organized successfully.' });
  } catch (error) {
    // 错误处理
    reply.status(500).send({ error: error.message });
  }
});

// 服务器启动配置
const start = async () => {
  try {
    // 设置服务器监听的端口
    await fastify.listen(3000);
    fastify.log.info(`Server is listening on port ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// 导出启动函数
module.exports = {
  start,
  organizeFolderStructure,
};

// 用于测试的入口点
if (require.main === module) {
  start();
}
