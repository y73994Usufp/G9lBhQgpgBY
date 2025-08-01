// 代码生成时间: 2025-08-02 05:20:29
const fastify = require('fastify')({ logger: true });
const ExcelJS = require('exceljs');

// 定义Excel工作表生成器函数
async function generateWorksheet(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // 将数据添加到工作表
  data.forEach((row, index) => {
    worksheet.addRow(row);
  });

  // 返回工作簿的Buffer数据
  return workbook.xlsx.writeBuffer();
}

// 创建路由处理函数
fastify.post('/generate-excel', async (request, reply) => {
  try {
    // 获取请求体中的数据
    const { data } = request.body;

    // 检查数据是否有效
    if (!data || !Array.isArray(data)) {
      reply.status(400).send({ error: 'Invalid data provided' });
      return;
    }

    // 生成Excel工作簿
    const buffer = await generateWorksheet(data);

    // 设置响应头以下载文件
    reply
      .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      .header('Content-Disposition', 'attachment; filename=generated_excel.xlsx')
      .send(buffer);
  } catch (error) {
    // 错误处理
    reply.status(500).send({ error: error.message });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();