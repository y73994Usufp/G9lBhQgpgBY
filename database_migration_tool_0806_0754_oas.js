// 代码生成时间: 2025-08-06 07:54:34
const fastify = require('fastify')({ logger: true });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// 数据库配置
const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  database: 'your_database',
  password: 'your_password',
  port: 5432
};

// 创建数据库连接池
const pool = new Pool(dbConfig);

// 读取迁移文件
const readMigrationFiles = (dir) => {
  return fs.readdirSync(dir).filter(file => file.endsWith('.sql'));
};

// 执行迁移文件
const executeMigration = async (filename) => {
  const fullPath = path.join(__dirname, 'migrations', filename);
  const migrationContent = fs.readFileSync(fullPath, 'utf8');
  try {
    const res = await pool.query(migrationContent);
    return res;
  } catch (err) {
    console.error(`Error executing migration ${filename}: ${err.message}`);
    throw err;
  }
};

// 应用所有迁移
const applyMigrations = async () => {
  const migrationFiles = readMigrationFiles(path.join(__dirname, 'migrations'));
  for (const filename of migrationFiles) {
    await executeMigration(filename);
  }
};

// Fastify 路由
fastify.get('/migrate', async (request, reply) => {
  try {
    await applyMigrations();
    reply.send({ message: 'Migrations applied successfully' });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to apply migrations', message: error.message });
  }
});

// 启动服务器
const startServer = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();

// 导出 Fastify 实例
module.exports = fastify;
