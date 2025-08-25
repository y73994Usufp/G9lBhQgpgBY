// 代码生成时间: 2025-08-25 19:33:38
const fastify = require('fastify');
const crypto = require('crypto');

// 创建一个 Fastify 实例
const app = fastify({ logger: true });

// 定义错误响应的接口
app.setErrorHandler((error, request, reply) => {
    reply.send({
        code: error.code,
        message: error.message,
        stack: error.stack
    });
});

// 哈希值计算工具的路由
app.post('/hash-calculator', async (request, reply) => {
    // 从请求体中获取待计算哈希的数据
    const { data, algorithm = 'sha256' } = request.body;

    // 检查请求体中的数据是否有效
    if (!data) {
        throw new Error('Data is required for hash calculation');
    }

    // 使用 crypto 模块计算哈希值
    const hash = crypto.createHash(algorithm).update(data, 'utf8').digest('hex');

    // 返回计算结果
    return {
        originalData: data,
        hash: hash
    };
});

// 监听端口
const start = async () => {
    try {
        await app.listen({ port: 3000 });
        app.log.info(`Server is running on http://127.0.0.1:3000`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

// 导出启动函数
module.exports = {
    start: start,
    app: app
};

// 调用 start 函数启动服务器
if (require.main === module) {
    start();
}
