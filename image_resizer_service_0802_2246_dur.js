// 代码生成时间: 2025-08-02 22:46:56
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp'); // 引入Jimp库用于图片处理

// 配置Fastify静态文件服务
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
});

// 上传图片接口
fastify.post('/upload', async (request, reply) => {
  const file = request.file;
  if (!file) {
    return reply.status(400).send({ error: 'No file uploaded' });
  }
  try {
    // 保存上传的图片
    const filePath = path.join(__dirname, 'uploads', file.filename);
    await fs.promises.writeFile(filePath, file.buffer);

    // 调用resizeImage函数调整图片尺寸
    const resizedImagePath = await resizeImage(filePath, file.filename, 800, 600); // 假设我们要调整到800x600尺寸
    return { message: 'Image uploaded and resized', resizedImagePath };
  } catch (error) {
    reply.status(500).send({ error: 'Failed to resize image' });
  }
});

// 批量调整图片尺寸接口
fastify.post('/resize-batch', async (request, reply) => {
  const { images, width, height } = request.body;
  if (!images || !width || !height) {
    return reply.status(400).send({ error: 'Invalid request body' });
  }
  try {
    const resizedPaths = [];
    for (const image of images) {
      const filePath = path.join(__dirname, 'uploads', image.filename);
      const resizedImagePath = await resizeImage(filePath, image.filename, width, height);
      resizedPaths.push(resizedImagePath);
    }
    return { message: 'Batch images resized', resizedPaths };
  } catch (error) {
    reply.status(500).send({ error: 'Failed to resize batch images' });
  }
});

// 图片尺寸调整函数
async function resizeImage(filePath, filename, width, height) {
  try {
    const image = await Jimp.read(filePath);
    const resizedImage = image.resize(width, height);
    const resizedImagePath = path.join(__dirname, 'resized', filename);
    await resizedImage.writeAsync(resizedImagePath);
    return resizedImagePath;
  } catch (error) {
    throw new Error(`Error resizing image: ${error.message}`);
  }
}

// 启动服务
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// 模块导出
module.exports = fastify;