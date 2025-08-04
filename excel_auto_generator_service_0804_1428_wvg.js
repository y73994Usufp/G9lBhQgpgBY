// 代码生成时间: 2025-08-04 14:28:44
const fastify = require('fastify')({ logger: true });
const ExcelJS = require('exceljs');

// 创建一个Excel工作簿
const workbook = new ExcelJS.Workbook();

// 创建一个工作表
const worksheet = workbook.addWorksheet('Generated Data');

// 添加一个样式用于单元格
const style = workbook.createStyle({
  font: {
    color: '00FF00', // Green color
  },
  alignment: {
    vertical: 'middle',
    horizontal: 'center',
  },
  borders: {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  },
});

// 添加一些数据到工作表
worksheet.addRow({
  1: 'ID',
  2: 'Name',
  3: 'Age',
}).style = style;

for (let i = 2; i < 100; i++) {
  worksheet.addRow({
    1: i,
    2: `Name${i}`,
    3: Math.floor(Math.random() * 100),
  }).style = style;
}

// 定义一个POST路由来处理Excel文件的生成
fastify.post('/create-excel', async (request, reply) => {
  try {
    // 读取请求体中的数据（假设发送的是JSON数据）
    const data = request.body;
    // 可以根据请求中的数据动态添加行到工作表
    // ...

    // 将工作簿写入到一个流中（这里以Buffer为例，实际使用时可以写入文件或发送给客户端）
    const buffer = await workbook.xlsx.writeBuffer();
    // 设置响应头
    reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    reply.header('Content-Disposition', 'attachment; filename=generated-excel.xlsx');
    // 发送响应和文件内容
    reply.send(buffer);
  } catch (error) {
    // 错误处理
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// 启动服务
fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
