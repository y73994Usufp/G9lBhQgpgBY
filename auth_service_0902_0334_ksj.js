// 代码生成时间: 2025-09-02 03:34:15
const fastify = require('fastify')({ logger: true });

// 模拟的用户数据库
const users = {
    'user1': 'password1',
    'user2': 'password2'
};

// 用户身份验证中间件
async function authenticate(req, reply) {
    const { username, password } = req.body;
    if (!username || !password) {
        reply.code(400).send({ error: 'Bad Request', message: 'Username and password are required' });
        return;
    }
    if (users[username] !== password) {
        reply.code(401).send({ error: 'Unauthorized', message: 'Invalid username or password' });
        return;
    }
    req.user = username;
}

// 创建身份认证的路由
fastify.post('/auth', {
    preValidation: authenticate
}, async (req, reply) => {
    // 认证成功，返回用户信息
    reply.send({ message: `Welcome ${req.user}!` });
});

// 错误处理
fastify.setErrorHandler((err, req, reply) => {
    reply.status(err.statusCode).send({
        error: err.message
    });
});

// 启动服务器
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        fastify.log.info(`Auth service listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();