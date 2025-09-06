// 代码生成时间: 2025-09-07 02:24:42
const fastify = require('fastify')({ logger: true });
const crypto = require('crypto');

// 设置加密密钥
const secretKey = 'my_secret_key';

// 加密函数
function encryptPassword(password) {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// 解密函数
function decryptPassword(encryptedPassword) {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 加密密码的路由
fastify.post('/api/encrypt', async (request, reply) => {
  try {
    const { password } = request.body;
    if (!password) {
      return reply.status(400).send({ error: 'Password is required' });
    }
    const encrypted = encryptPassword(password);
    return { encrypted };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// 解密密码的路由
fastify.post('/api/decrypt', async (request, reply) => {
  try {
    const { encryptedPassword } = request.body;
    if (!encryptedPassword) {
      return reply.status(400).send({ error: 'Encrypted password is required' });
    }
    const decrypted = decryptPassword(encryptedPassword);
    return { decrypted };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is listening on port ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
