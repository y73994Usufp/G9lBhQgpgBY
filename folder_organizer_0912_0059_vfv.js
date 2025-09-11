// 代码生成时间: 2025-09-12 00:59:33
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');

// 定义一个函数来递归地整理文件夹
function organizeFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const fileStats = fs.statSync(filePath);
    if (fileStats.isDirectory()) {
      // 如果是文件夹，递归整理
      organizeFolder(filePath);
    } else {
      // 如果是文件，移动到对应的文件夹
      const extension = path.extname(file);
      const targetFolder = path.join(folderPath, extension.slice(1));
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }
      fs.renameSync(filePath, path.join(targetFolder, file));
    }
  });
}

// 创建一个路由，用于触发文件夹整理
fastify.post('/organize', async (request, reply) => {
  const { folderPath } = request.body;
  // 检查路径是否存在
  if (!fs.existsSync(folderPath)) {
    return reply.code(404).send({ message: 'Folder not found' });
  }
  // 检查路径是否是文件夹
  if (!fs.statSync(folderPath).isDirectory()) {
    return reply.code(400).send({ message: 'Provided path is not a folder' });
  }
  try {
    organizeFolder(folderPath);
    reply.code(200).send({ message: 'Folder organized successfully' });
  } catch (error) {
    reply.code(500).send({ message: 'Failed to organize folder', error: error.message });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on port ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// 以下是代码解释：
/*
 * 文件夹整理器使用FASTIFY框架创建一个HTTP服务，允许用户通过POST请求触发文件夹整理。
 * 它定义了一个`organizeFolder`函数，递归地遍历指定文件夹中的所有文件，并根据文件扩展名将文件移动到对应的文件夹中。
 * 如果目标文件夹不存在，则创建它。
 * POST请求的`/organize`路由接受一个包含`folderPath`属性的请求体，表示要整理的文件夹路径。
 * 服务端会检查路径是否存在且是否为文件夹，然后尝试整理文件夹。
 * 如果整理成功，返回200状态码和成功消息；如果发生错误，返回500状态码和错误消息。
 * 注意：该代码示例应作为一个起点，并根据实际需求进行调整和扩展。
 */