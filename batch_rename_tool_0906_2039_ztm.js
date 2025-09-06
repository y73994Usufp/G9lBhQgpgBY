// 代码生成时间: 2025-09-06 20:39:11
const fs = require('fs');
const path = require('path');
const fastify = require('fastify')({ logger: true });

// Define the route for renaming files
fastify.post('/rename', async (request, reply) => {
  // Extract directory and naming pattern from request body
  const { directory, pattern } = request.body;

  // Validate the input
  if (!directory || !pattern) {
    return reply.status(400).send({
      error: 'Missing required parameters: directory and pattern'
    });
  }

  try {
    // Read the directory contents
    const files = fs.readdirSync(directory);

    // Loop through each file and rename it
    for (const file of files) {
      const oldPath = path.join(directory, file);
      const stats = fs.statSync(oldPath);

      // Skip if it's not a file
      if (!stats.isFile()) continue;

      // Generate the new file name
      const newFileName = `${pattern}-${file}`;
      const newPath = path.join(directory, newFileName);

      // Rename the file
      fs.renameSync(oldPath, newPath);
    }

    // Return success message
    return reply.send({
      message: 'Files have been successfully renamed'
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return reply.status(500).send({
      error: error.message
    });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server running at http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();