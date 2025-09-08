// 代码生成时间: 2025-09-08 16:05:14
const fastify = require('fastify')({ logger: true });
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Initialize AJV instance with format support
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Define a schema for form data validation
const formSchema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 3 },
    email: { type: 'string', format: 'email' },
    age: { type: 'integer', minimum: 18 }
  },
  required: ['username', 'email', 'age'],
  additionalProperties: false
};

// Compile the schema
const validate = ajv.compile(formSchema);

// Validator function
const validateFormData = (req, res) => {
  if (validate(req.body)) {
    return true;
  } else {
    // Handle validation errors
    const errors = validate.errors.map((err) => err.message).join(', ');
    res.status(400).send({
      error: 'Validation failed',
      errors: errors
    });
    return false;
  }
};

// Route for form data submission
fastify.post('/submit-form', (request, reply) => {
  // Validate form data
  if (!validateFormData(request, reply)) {
    reply.send({ message: 'Failed to process the form' });
  } else {
    // Process the valid form data
    reply.send({ message: 'Form data is valid', data: request.body });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();