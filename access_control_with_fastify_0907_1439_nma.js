// 代码生成时间: 2025-09-07 14:39:09
const fastify = require('fastify')({ logger: true });

// 定义一个简单的用户角色枚举
const Role = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
};

// 一个简单的权限检查装饰器
function accessControl(requiredRole) {
    return function (handler) {
        return async function (request, reply) {
            const userRole = request.user.role;
            if (userRole !== requiredRole) {
                reply.status(403).send({ error: 'Forbidden', message: 'You do not have permission to access this resource.' });
                return;
            }
            return handler(request, reply);
        };
    };
}

// 注册一个路由，需要管理员权限才能访问
fastify.get('/admin-only', accessControl(Role.ADMIN), async (request, reply) => {
    return { message: 'Welcome admin!' };
});

// 注册一个路由，需要用户权限才能访问
fastify.get('/user-only', accessControl(Role.USER), async (request, reply) => {
    return { message: 'Welcome user!' };
});

// 注册一个不需要权限的公开路由
fastify.get('/public', async (request, reply) => {
    return { message: 'This is a public route.' };
});

// 错误处理
fastify.setErrorHandler((err, request, reply) => {
    reply.status(err.statusCode || 500).send({
        error: err.message || 'Internal Server Error'
    });
});

// 监听端口
const start = async () => {
    try {
        await fastify.listen(3000);
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();

// 注意：这个简单的示例假设请求对象已经包含了一个user属性，其中包含了用户角色信息。
// 在实际应用中，你需要实现用户认证和角色提取的逻辑。