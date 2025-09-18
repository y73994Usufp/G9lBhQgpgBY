// 代码生成时间: 2025-09-19 06:17:24
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const util = require('util');

// 引入node-schedule库用于定时任务
const schedule = require('node-schedule');

// 定义备份和同步的函数
const backupAndSync = async (source, destination) => {
  try {
    // 读取源目录
    const files = await util.promisify(fs.readdir)(source);
    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);
      // 检查是否为文件
      if (await util.promisify(fs.stat)(sourcePath).isFile()) {
        // 同步文件到目标目录
        const readStream = fs.createReadStream(sourcePath);
        const writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);
      }
    }
  } catch (error) {
    fastify.log.error(`Backup and sync error: ${error.message}`);
    throw error;
  }
};

// 创建备份和同步定时任务
const setupSchedule = (source, destination, scheduleRule) => {
  schedule.scheduleJob(scheduleRule, () => {
    backupAndSync(source, destination)
      .then(() => fastify.log.info('Backup and sync completed successfully.'))
      .catch((error) => fastify.log.error(`Backup and sync error: ${error.message}`));
  });
};

// 定义Fastify路由
fastify.get('/backup-and-sync', async (request, reply) => {
  const { source, destination } = request.query;
  if (!source || !destination) {
    return reply.status(400).send({ error: 'Source and destination paths are required.' });
  }
  if (!fs.existsSync(source) || !fs.existsSync(destination)) {
    return reply.status(400).send({ error: 'Source or destination path does not exist.' });
  }

  try {
    // 执行备份和同步操作
    await backupAndSync(source, destination);
    reply.send({ message: 'Backup and sync operation completed successfully.' });
  } catch (error) {
    reply.status(500).send({ error: `Backup and sync error: ${error.message}` });
  }
});

// 启动Fastify服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running at ${fastify.server.address().port}`);
  } catch (error) {
    fastify.log.error(`Server startup error: ${error.message}`);
    process.exit(1);
  }
};

start();

// 注释说明：
// 该程序定义了一个文件备份和同步工具，使用Fastify框架创建HTTP服务。
// 它提供了一个HTTP GET接口 '/backup-and-sync'，通过查询参数接收源目录和目标目录路径。
// 程序会检查源目录和目标目录是否存在，然后执行备份和同步操作。
// 同时，程序还提供了一个定时任务功能，可以通过'setupSchedule'函数设置定时备份和同步。
