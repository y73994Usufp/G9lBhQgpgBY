// 代码生成时间: 2025-08-20 10:38:16
const fs = require('fs-extra');
const fastify = require('fastify')({ logger: true });

// 定义备份和同步文件的函数
async function backupFileSync(source, target) {
  try {
    await fs.copy(source, target);
    console.log(`File successfully backed up from ${source} to ${target}`);
  } catch (err) {
    console.error(`Error occurred during backup: ${err.message}`);
    throw err;
  }
}

// 创建快照备份函数
async function createSnapshotBackup(source, target) {
  try {
    await backupFileSync(source, target);
  } catch (err) {
    // 错误处理
    fastify.log.error(err);
  }
}

// 设置Fastify路由以处理备份请求
fastify.post('/api/backup', async (request, reply) => {
  // 从请求体中获取源和目标路径
  const { sourcePath, targetPath } = request.body;
  if (!sourcePath || !targetPath) {
    return reply.status(400).send({ error: 'Source and target paths are required' });
  }

  try {
    // 执行备份操作
    await createSnapshotBackup(sourcePath, targetPath);
    return reply.status(200).send({ message: 'Backup completed successfully' });
  } catch (err) {
    // 错误处理
    return reply.status(500).send({ error: err.message });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();