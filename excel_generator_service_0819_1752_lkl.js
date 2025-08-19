// 代码生成时间: 2025-08-19 17:52:46
// 引入Fastify
const fastify = require('fastify')({ logger: true });

// 引入ExcelJS库
const ExcelJS = require('exceljs');

// Excel工作簿
const workbook = new ExcelJS.Workbook();

// 创建一个工作表
const worksheet = workbook.addWorksheet('My Sheet');

// 示例数据
const data = [
  ['ID', 'Name', 'Age'],
  [1, 'John Doe', 30],
  [2, 'Jane Doe', 25],
  [3, 'Foo Bar', 22],
];

// 将数据写入工作表
data.forEach((row, index) => {
  if (index === 0) {
    // 标题行
    worksheet.columns = row.map(header => ({ header, key: header.toLowerCase(), width: 10 }));
  } else {
    // 数据行
    worksheet.addRow(row);
  }
});

// 路由：生成Excel文件
fastify.get('/generate-excel', async (request, reply) => {
  try {
    // 将工作簿写入缓冲区
    const buffer = await workbook.xlsx.writeBuffer();
    // 设置响应头
    reply
      .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      .header('Content-Disposition', 'attachment; filename=generated-excel.xlsx');
    // 发送文件流
    reply.send(buffer);
  } catch (error) {
    // 错误处理
    reply.status(500).send({ error: 'Failed to generate Excel file' });
  }
});

// 启动服务器
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