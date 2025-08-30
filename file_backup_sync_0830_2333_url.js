// 代码生成时间: 2025-08-30 23:33:17
const fs = require('fs-extra');
const path = require('path');
const fastify = require('fastify')({ logger: true });

// 配置Fastify日志
fastify.setLogger({ prettyPrint: true });

// 备份文件的函数
async function backupFile(source, destination) {
  try {
    // 检查源文件是否存在
    if (!(await fs.pathExists(source))) {
      throw new Error(`Source file does not exist: ${source}`);
    }
    // 确保目标目录存在
    await fs.ensureDir(path.dirname(destination));
    // 复制文件
    await fs.copyFile(source, destination);
    return { status: 'success', message: 'File backed up successfully' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

// 文件同步函数
async function syncFiles(source, destination) {
  try {
    // 检查源目录与目标目录
    if (!(await fs.pathExists(source))) {
      throw new Error(`Source directory does not exist: ${source}`);
    }
    if (!(await fs.pathExists(destination))) {
      throw new Error(`Destination directory does not exist: ${destination}`);
    }
    // 同步文件
    await fs.ensureSymlink(source, destination, 'dir');
    return { status: 'success', message: 'Directories synchronized' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

// Fastify路由：备份文件
fastify.post('/api/backup', async (request, reply) => {
  const { source, destination } = request.body;
  const result = await backupFile(source, destination);
  // 返回备份结果
  reply.send(result);
});

// Fastify路由：同步文件
fastify.post('/api/sync', async (request, reply) => {
  const { source, destination } = request.body;
  const result = await syncFiles(source, destination);
  // 返回同步结果
  reply.send(result);
});

// 启动Fastify服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`File backup and sync server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();