// 代码生成时间: 2025-09-12 12:27:08
const fastify = require('fastify')({ logger: true });
const crypto = require('crypto');

// 配置加密解密工具的服务
class PasswordToolService {
  // 加密密码
  async encryptPassword(password) {
    try {
      // 使用SHA-256算法进行加密
      const hash = crypto.createHash('sha256');
      hash.update(password);
      return hash.digest('hex');
    } catch (error) {
      // 错误处理
      throw new Error('Failed to encrypt password: ' + error.message);
    }
  }

  // 解密密码（注意：SHA-256是单向加密，无法解密）
  async decryptPassword(encryptedPassword) {
    // 由于SHA-256算法的特性，实际上无法解密
    throw new Error('Decryption is not possible with SHA-256 encryption');
  }
}

// 实例化服务
const passwordToolService = new PasswordToolService();

// 创建加密路由
fastify.post('/encrypt', async (request, reply) => {
  const { password } = request.body;
  if (!password) {
    reply.status(400).send({
      error: 'Password is required'
    });
  } else {
    try {
      const encryptedPassword = await passwordToolService.encryptPassword(password);
      reply.send({
        originalPassword: password,
        encryptedPassword: encryptedPassword
      });
    } catch (error) {
      reply.status(500).send({
        error: error.message
      });
    }
  }
});

// 创建解密路由（仅供展示，实际上不实现解密）
fastify.post('/decrypt', async (request, reply) => {
  const { encryptedPassword } = request.body;
  if (!encryptedPassword) {
    reply.status(400).send({
      error: 'Encrypted password is required'
    });
  } else {
    try {
      await passwordToolService.decryptPassword(encryptedPassword);
      reply.send({
        message: 'Decryption is not supported for SHA-256 encryption'
      });
    } catch (error) {
      reply.status(500).send({
        error: error.message
      });
    }
  }
});

// 启动服务
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running at ${fastify.server.address().port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();