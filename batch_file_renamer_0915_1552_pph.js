// 代码生成时间: 2025-09-15 15:52:33
const fastify = require('fastify')({
  // Enable logger for production use
  logger: true
});

// Importing the fs module for file system operations
const fs = require('fs');
const path = require('path');

// Utility function to rename files
const renameFiles = async (dir, renameMap) => {
  for (const [oldName, newName] of Object.entries(renameMap)) {
    const oldPath = path.join(dir, oldName);
    const newPath = path.join(dir, newName);
    // Check if the old file exists before renaming
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
    } else {
      throw new Error(`File ${oldName} not found in the directory`);
    }
  }
};

// Route to handle renaming requests
fastify.post('/files/rename', async (request, reply) => {
  try {
    // Extract directory and rename map from the request body
    const { directory, renameMap } = request.body;

    // Validate the directory and rename map
    if (!directory || typeof renameMap !== 'object' || Array.isArray(renameMap)) {
      reply.status(400).send({
        error: 'Invalid request data'
      });
      return;
    }

    // Check if the directory exists
    if (!fs.existsSync(directory)) {
      reply.status(404).send({
        error: `Directory ${directory} not found`
      });
      return;
    }

    // Perform the file renaming
    await renameFiles(directory, renameMap);

    // Send success response
    reply.send({
      message: 'Files renamed successfully',
      renamedFiles: renameMap
    });
  } catch (error) {
    // Handle errors and send error response
    reply.status(500).send({
      error: error.message
    });
  }
});

// Listen on the provided port
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info('Server is running on http://127.0.0.1:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();