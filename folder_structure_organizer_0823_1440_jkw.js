// 代码生成时间: 2025-08-23 14:40:32
const fastify = require('fastify')({
  // 设置日志级别，便于调试
  logger: true
});

// 引入第三方库用于文件系统操作
const fs = require('fs-extra');
const path = require('path');

// 定义一个简单的文件夹结构整理器
class FolderStructureOrganizer {
  // 构造函数，接收原始路径和目标路径
  constructor(sourcePath, targetPath) {
    this.sourcePath = sourcePath;
    this.targetPath = targetPath;
  }

  // 整理文件夹结构
  async organize() {
    try {
      // 读取原始路径下的所有文件和文件夹
      const files = await fs.readdir(this.sourcePath, { withFileTypes: true });

      // 遍历所有文件和文件夹
      for (const file of files) {
        const filePath = path.join(this.sourcePath, file.name);

        // 如果是文件夹，则递归整理
        if (file.isDirectory()) {
          await this.organizeFolder(filePath);
        } else {
          // 复制文件到目标路径
          await this.copyFile(filePath);
        }
      }

      this.log('Folder structure organized successfully.');
    } catch (error) {
      this.logError('Error organizing folder structure:', error);
    }
  }

  // 递归整理文件夹
  async organizeFolder(folderPath) {
    const folderName = path.basename(folderPath);
    const targetFolderPath = path.join(this.targetPath, folderName);
    await fs.ensureDir(targetFolderPath);

    // 递归整理子文件夹
    const subFiles = await fs.readdir(folderPath, { withFileTypes: true });
    for (const file of subFiles) {
      const filePath = path.join(folderPath, file.name);
      if (file.isDirectory()) {
        await this.organizeFolder(filePath);
      } else {
        await this.copyFile(filePath, targetFolderPath);
      }
    }
  }

  // 复制文件到目标路径
  async copyFile(filePath, targetPath = this.targetPath) {
    const fileName = path.basename(filePath);
    const targetFilePath = path.join(targetPath, fileName);
    await fs.copy(filePath, targetFilePath);
  }

  // 日志记录函数
  log(message) {
    fastify.log.info(message);
  }

  // 错误日志记录函数
  logError(message, error) {
    fastify.log.error(message, error);
  }
}

// 定义路由，用于触发文件夹结构整理器
fastify.post('/organize', async (request, reply) => {
  // 解析请求体中的路径信息
  const { sourcePath, targetPath } = request.body;

  // 创建文件夹结构整理器实例
  const organizer = new FolderStructureOrganizer(sourcePath, targetPath);

  try {
    // 执行整理操作
    await organizer.organize();
    reply.send({ message: 'Folder structure organized successfully.' });
  } catch (error) {
    // 错误处理
    fastify.log.error('Error organizing folder structure:', error);
    reply.status(500).send({ error: 'Failed to organize folder structure.' });
  }
});

// 监听服务端口
const start = async () => {
  try {
    // 监听端口
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();