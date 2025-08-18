// 代码生成时间: 2025-08-18 10:35:08
const fastify = require('fastify')({ logger: true });
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// 定义 unzip 函数，用于解压文件
async function unzip(filePath, outputPath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(zlib.createGunzip())
      .pipe(fs.createWriteStream(outputPath))
      .on('finish', () => resolve())
      .on('error', (err) => reject(err));
  });
}

// 定义压缩文件解压路由
fastify.post('/decompress', async (request, reply) => {
  // 从请求中获取文件
  const file = request.file;
  if (!file) {
    return reply.status(400).send({
      error: 'No file provided'
    });
  }

  // 设置解压文件的输出路径
  const outputPath = path.join('output', `${file.filename}.decompressed`);

  try {
    // 解压文件
    await unzip(file.path, outputPath);
    // 返回解压后的文件信息
    return {
      message: 'File decompressed successfully',
      outputPath: outputPath
    };
  } catch (err) {
    // 错误处理
    return reply.status(500).send({
      error: 'Failed to decompress file',
      message: err.message
    });
  }
});

// 插件配置
fastify.register(require('fastify-multipart'));

// 配置静态文件服务，用于提供解压后的文件访问
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'output'),
  prefix: '/output'
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info('Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();