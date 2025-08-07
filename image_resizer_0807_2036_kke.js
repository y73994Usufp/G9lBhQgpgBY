// 代码生成时间: 2025-08-07 20:36:10
const fs = require('fs');
const path = require('path');
const Fastify = require('fastify');
const sharp = require('sharp');

// 创建Fastify实例
const app = Fastify({ logger: true });

// 配置静态文件目录
app.register(require('fastify-static'), {
  root: '.',
  prefix: '/public/', // 通过/public/访问静态文件
});

// 处理图片上传和尺寸调整
app.post('/api/resize-image', async (request, reply) => {
  try {
    // 检查请求中是否包含文件
    if (!request.body || !request.body.imageBuffer) {
      reply.code(400).send({ error: 'No image provided' });
      return;
    }

    // 读取图片缓冲区
    const imageBuffer = request.body.imageBuffer;

    // 定义输出图片的文件名和路径
    const outputPath = path.join('.', 'public', 'resized-image.jpg');

    // 使用sharp调整图片尺寸
    const resizedImage = await sharp(imageBuffer)
      .resize({ width: 800, height: 600 })
      .toBuffer();

    // 将调整后的图片保存到文件系统
    fs.writeFileSync(outputPath, resizedImage);

    // 返回成功响应
    reply.send({
      message: 'Image resized successfully',
      outputPath,
    });
  } catch (error) {
    // 错误处理
    reply.code(500).send({ error: error.message });
  }
});

// 启动服务器
const start = async () => {
  try {
    await app.listen(3000);
    app.log.info(`Server is running at ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();