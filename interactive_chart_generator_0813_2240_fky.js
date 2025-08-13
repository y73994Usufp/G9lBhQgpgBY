// 代码生成时间: 2025-08-13 22:40:38
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Middleware to parse JSON body
fastify.use(require('fastify-formbody'));

// Helper function to load template
function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
  return fs.readFileSync(templatePath, 'utf8');
}

// Route to generate interactive chart
fastify.post('/chart', async (request, reply) => {
  try {
    // Destructure chart data from request body
    const { chartType, data } = request.body;

    // Validate chart type and data
    if (!chartType || !data) {
      reply.code(400).send({ error: 'Chart type and data are required' });
      return;
    }

    // Load the handlebars template for the chart
    const template = loadTemplate(chartType);

    // Compile the template with data
    const html = Handlebars.compile(template)(data);

    // Send the generated HTML as response
    reply.type('html').send(html);
  } catch (error) {
    // Handle any errors that occur during the process
    fastify.log.error(error);
    reply.code(500).send({ error: 'Internal server error' });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Interactive chart generator server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// Export fastify instance for testing purposes
module.exports = fastify;

// Note: This code assumes that Handlebars templates for different chart types exist in the 'templates' directory
// and that they are named according to the chart type (e.g., 'line-chart.hbs', 'bar-chart.hbs', etc.).
// The 'templates' directory should be at the same level as this script.
