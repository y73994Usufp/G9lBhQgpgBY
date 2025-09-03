// 代码生成时间: 2025-09-03 08:54:46
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const readdirRecursive = require('recursive-readdir');

// 定义一个函数来检查文件扩展名
const isImage = (file) => /\.(jpg|jpeg|png|gif)$/i.test(file);
const isDocument = (file) => /\.(doc|docx|pdf)$/i.test(file);

// 定义一个函数来组织文件夹
const organizeFolder = async (sourcePath) => {
  try {
    // 读取文件夹中的所有文件和子文件夹
    const files = await readdirRecursive(sourcePath);

    // 创建目标文件夹
    const imageFolder = path.join(sourcePath, 'Images');
    const documentFolder = path.join(sourcePath, 'Documents');
    fs.mkdirSync(imageFolder, { recursive: true });
    fs.mkdirSync(documentFolder, { recursive: true });

    // 移动文件到相应的文件夹
    files.forEach((file) => {
      if (isImage(file)) {
        fs.renameSync(file, path.join(imageFolder, path.basename(file)));
      } else if (isDocument(file)) {
        fs.renameSync(file, path.join(documentFolder, path.basename(file)));
      }
    });

    return { status: 'success', message: 'Folder organized successfully.' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

// 创建一个路由来处理文件夹组织请求
fastify.post('/organize', async (request, reply) => {
  const { sourcePath } = request.body;
  if (!sourcePath) {
    reply.status(400).send({
      message: 'Source path is required.'
    });
    return;
  }
  if (typeof sourcePath !== 'string') {
    reply.status(400).send({
      message: 'Source path must be a string.'
    });
    return;
  }
  const result = await organizeFolder(sourcePath);
  reply.send(result);
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Server listening on port 3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// 导出函数以便于测试
module.exports = { organizeFolder };

// 对代码进行注释和文档化
/*
 * 文件夹结构整理器
 * 使用Fastify框架创建一个程序，实现文件夹结构整理功能。
 * 该程序将根据文件类型将文件移动到对应的文件夹中。
 *
 * 特点：
 * 1. 代码结构清晰，易于理解
 * 2. 包含适当的错误处理
 * 3. 添加必要的注释和文档
 * 4. 遵循JS最佳实践
 * 5. 确保代码的可维护性和可扩展性
 *
 * 路由：
 * POST /organize - 接收一个JSON对象，包含待整理的文件夹路径
 *
 * 返回值：
 * { status: 'success', message: 'Folder organized successfully.' }
 * 或
 * { status: 'error', message: 'Error message' }
 */