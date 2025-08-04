// 代码生成时间: 2025-08-05 00:40:13
const fastify = require('fastify')({ logger: true });
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 定义图片尺寸批量调整器服务
class ImageResizerService {
    constructor() {
        this.resizedFolderPath = './resized_images';
    }

    // 确保输出目录存在
    ensureOutputDirectory() {
        const exists = fs.existsSync(this.resizedFolderPath);
        if (!exists) {
            fs.mkdirSync(this.resizedFolderPath, { recursive: true });
        }
    }

    // 调整图片尺寸
    resizeImage(inputPath, outputPath, options) {
        return sharp(inputPath)
            .resize(options)
            .toFormat('jpeg')
            .toFile(outputPath);
    }

    // 批量调整图片尺寸
    resizeMultipleImages(inputPaths, options) {
        const promises = inputPaths.map((inputPath) => {
            const outputPath = path.join(this.resizedFolderPath, path.basename(inputPath));
            return this.resizeImage(inputPath, outputPath, options);
        });
        return Promise.all(promises);
    }
}

// 创建服务实例
const imageResizerService = new ImageResizerService();

// 确保输出目录存在
imageResizerService.ensureOutputDirectory();

// 定义Fastify路由处理批量图片尺寸调整请求
fastify.post('/resize-images', async (request, reply) => {
    try {
        // 获取上传的图片路径和尺寸调整参数
        const { inputPaths, options } = request.body;
        if (!inputPaths || !options) {
            reply.status(400).send({ error: 'Missing input paths or resize options' });
            return;
        }

        // 批量调整图片尺寸
        await imageResizerService.resizeMultipleImages(inputPaths, options);

        // 返回成功响应
        reply.send({ message: 'Images resized successfully' });
    } catch (error) {
        // 错误处理
        console.error(error);
        reply.status(500).send({ error: 'Internal server error' });
    }
});

// 启动Fastify服务器
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        fastify.log.info(`Server is running on http://127.0.0.1:${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();