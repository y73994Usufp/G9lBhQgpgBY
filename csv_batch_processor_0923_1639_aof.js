// 代码生成时间: 2025-09-23 16:39:45
const Fastify = require('fastify');
const fs = require('fs');
const csv = require('csv-parser');
const { Transform } = require('stream');
const path = require('path');

// 创建 Fastify 实例
const fastify = Fastify({ logger: true });

// 定义错误处理中间件
function errorHandler(err, request, reply) {
  reply.send({
    error: err.message,
    statusCode: err.statusCode || 500,
  });
}

// 定义 CSV 文件处理流
class CsvFileStream extends Transform {
  constructor(options) {
    super(options);
    this.data = [];
  }
  _transform(chunk, encoding, callback) {
    const records = chunk.toString().split('
');
    records.forEach(record => {
      if (record) {
        this.data.push(record);
      }
    });
    callback();
  }
  _flush(callback) {
    this.push(this.data.join('
'));
    callback();
  }
}

// 定义处理单个 CSV 文件的函数
async function processCsvFile(file) {
  return new Promise((resolve, reject) => {
    const csvStream = fs.createReadStream(file)
      .pipe(csv())
      .pipe(new CsvFileStream());

    csvStream.on('finish', () => {
      resolve(csvStream.read());
    });
    csvStream.on('error', err => {
      reject(err);
    });
  });
}

// 定义批量处理 CSV 文件的函数
async function batchProcessCsvFiles(files) {
  try {
    const results = await Promise.all(files.map(processCsvFile));
    return results;
  } catch (err) {
    throw new Error(`Batch processing failed: ${err.message}`);
  }
}

// 定义路由处理上传的 CSV 文件
fastify.post('/upload', async (request, reply) => {
  if (!request.body.files || request.body.files.length === 0) {
    throw new Error('No files provided');
  }

  const files = request.body.files.map(file => file.filepath);
  try {
    const processedData = await batchProcessCsvFiles(files);
    reply.send({ data: processedData });
  } catch (err) {
    reply.send(errorHandler(err));
  }
});

// 启动 Fastify 服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();