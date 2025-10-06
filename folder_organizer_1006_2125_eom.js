// 代码生成时间: 2025-10-06 21:25:44
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');

// 文件夹结构整理器的配置
const config = {
  targetDirectory: '/path/to/your/directory', // 目标文件夹路径
  fileExtensions: ['js', 'css', 'html'], // 需要整理的文件扩展名
  destinationSubfolders: {
    'js': 'javascript',
    'css': 'styles',
    'html': 'html'
  }
};

// 函数：检查目标文件夹是否存在，如果不存在则创建
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// 函数：移动文件到指定的子文件夹
function moveFileToSubfolder(sourcePath, destinationPath) {
  ensureDirectoryExists(destinationPath);
  const destination = path.join(destinationPath, path.basename(sourcePath));
  fs.renameSync(sourcePath, destination);
}

// 函数：整理文件夹结构
function organizeFolderStructure(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, dirents) => {
    if (err) {
      fastify.log.error(err);
      throw err;
    }
    dirents.forEach(dirent => {
      if (dirent.isFile() && config.fileExtensions.includes(path.extname(dirent.name).slice(1))) {
        const fileExtension = path.extname(dirent.name).slice(1);
        const destinationSubfolder = config.destinationSubfolders[fileExtension];
        if (destinationSubfolder) {
          const sourcePath = path.join(directory, dirent.name);
          const destinationPath = path.join(directory, destinationSubfolder);
          moveFileToSubfolder(sourcePath, destinationPath);
        }
      }
    });
  });
}

// Fastify路由：触发文件夹整理
fastify.post('/organize', async (request, reply) => {
  try {
    organizeFolderStructure(config.targetDirectory);
    reply.send({ message: 'Folder structure organized successfully.' });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to organize folder structure.' });
  }
});

// 启动Fastify服务器
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