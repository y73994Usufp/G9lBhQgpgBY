// 代码生成时间: 2025-08-02 11:02:56
const Fastify = require('fastify');
const ExcelJS = require('exceljs');
const fs = require('fs');

// Initialize Fastify server
const server = Fastify({ logger: true });

// A utility function to generate an Excel workbook
async function generateExcelWorkbook(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add data to the worksheet
  worksheet.addRow(Object.keys(data[0]));
  for (const row of data) {
    worksheet.addRow(Object.values(row));
  }

  // Return the workbook as a buffer
  return workbook.xlsx.writeBuffer();
}

// Define a route to handle Excel generation
server.post('/api/generate-excel', async (request, reply) => {
  try {
    // Extract data from the request body
    const { data } = request.body;

    // Check if data is provided
    if (!data || !Array.isArray(data)) {
      return reply
        .code(400)
        .send({ error: 'Invalid data provided' });
    }

    // Generate the Excel workbook
    const buffer = await generateExcelWorkbook(data);

    // Set headers for the response
    reply.header('Content-Disposition', 'attachment; filename=generated_excel.xlsx');
    reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the buffer as a response
    reply.send(buffer);
  } catch (error) {
    // Handle any errors that occur during Excel generation
    server.log.error(error);
    reply.code(500).send({ error: 'Failed to generate Excel file' });
  }
});

// Start the server
server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server listening at ${address}`);
});
