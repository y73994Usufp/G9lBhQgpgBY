// 代码生成时间: 2025-09-11 01:53:32
 * Interactive Chart Generator using Fastify Framework
 * This program creates an API for generating interactive charts based on user input.
 *
 * @author Your Name
 * @version 1.0.0
 */

const Fastify = require('fastify');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const Chart = require('chart.js');
const fs = require('fs');

// Initialize Fastify
const fastify = Fastify({ logger: true });

// Initialize ChartJS Node Canvas with PNG support
const chartjsNodeCanvas = new ChartJSNodeCanvas({
  width: 800,
  height: 600,
  type: 'png'
});

// Register Fastify routes
fastify.get('/api/generate-chart', async (request, reply) => {
  // Retrieve chart options from query parameters
  const { type, data, options } = request.query;

  // Validate chart type and data
  if (!type || !data || !options) {
    reply.status(400).send({
      error: 'Missing required parameters: type, data, and options'
    });
    return;
  }

  try {
    // Create a new Chart instance
    const chart = new Chart(chartjsNodeCanvas, {
      type: type,
      data: JSON.parse(data),
      options: JSON.parse(options)
    });

    // Generate the chart and save as an image
    const buffer = await chart.toBuffer();
    const chartName = `chart-${Date.now()}.png`;
    fs.writeFileSync(`./${chartName}`, buffer);

    // Return the chart image name
    reply.send({
      filename: chartName,
      message: 'Chart generated successfully'
    });
  } catch (error) {
    // Handle any errors during chart generation
    reply.status(500).send({
      error: 'Failed to generate chart',
      details: error.message
    });
  }
});

// Start the Fastify server
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
