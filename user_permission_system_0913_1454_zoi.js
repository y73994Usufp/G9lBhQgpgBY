// 代码生成时间: 2025-09-13 14:54:56
const fastify = require('fastify')({ logger: true });

// 数据库模拟，实际应用中应替换为真实的数据库操作
const users = {
    'user1': {
        id: 'user1',
        name: 'John Doe',
        roles: ['admin']
    },
    'user2': {
        id: 'user2',
        name: 'Jane Doe',
        roles: ['user']
    }
};

// 权限检查中间件
async function authorizeUser(req, reply) {
    const { userId } = req.params;
    if (!users[userId]) {
        reply.status(404).send({ error: 'User not found' });
        return;
    }
    const user = users[userId];
    if (!user.roles.includes(req.role)) {
        reply.status(403).send({ error: 'Forbidden' });
        return;
    }
    req.user = user;
}

// 获取用户信息
fastify.get('/user/:userId', {
    preValidation: [authorizeUser]
}, async (req, reply) => {
    const user = req.user;
    return {
        id: user.id,
        name: user.name
    };
});

// 添加新用户
fastify.post('/user', async (req, reply) => {
    const { id, name, roles } = req.body;
    if (!id || !name || !roles) {
        reply.status(400).send({ error: 'Invalid user data' });
        return;
    }
    users[id] = { id, name, roles };
    return {
        id: id,
        name: name,
        roles: roles
    };
});

// 删除用户
fastify.delete('/user/:userId', {
    preValidation: [authorizeUser]
}, async (req, reply) => {
    const { userId } = req.params;
    delete users[userId];
    return {
        message: 'User deleted'
    };
});

// 更新用户信息
fastify.put('/user/:userId', {
    preValidation: [authorizeUser]
}, async (req, reply) => {
    const { userId } = req.params;
    const { name, roles } = req.body;
    if (!name && !roles) {
        reply.status(400).send({ error: 'Invalid user data' });
        return;
    }
    users[userId].name = name || users[userId].name;
    users[userId].roles = roles || users[userId].roles;
    return {
        id: userId,
        name: users[userId].name,
        roles: users[userId].roles
    };
});

// 启动服务器
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        fastify.log.info(`Server running on http://localhost:3000`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();