// 代码生成时间: 2025-09-09 13:58:36
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const csvParse = require('csv-parse');
const csvStringify = require('csv-stringify');
const path = require('path');

// Helper function to read CSV file from path
async function readCSV(filePath) {
    try {
        return new Promise((resolve, reject) => {
            const results = [];
            const stream = fs.createReadStream(filePath)
                .pipe(csvParse());
                
            stream.on('data', (data) => results.push(data));
            stream.on('end', () => resolve(results));
            stream.on('error', reject);
        });
    } catch (error) {
        throw new Error(`An error occurred while reading CSV file: ${error.message}`);
    }
}

// Helper function to write CSV data to a new file
function writeCSV(data, outputPath) {
    const stringify = csvStringify();
    stringify.pipe(fs.createWriteStream(outputPath));
    
    data.forEach((row) => stringify.write(row));
    stringify.end();
}

// Route handler to process multiple CSV files
fastify.post('/process-csv', async (request, reply) => {
    const { csvFiles, outputDirectory } = request.body;
    if (!csvFiles || !outputDirectory) {
        return reply.status(400).send({
            error: 'Missing required parameters: csvFiles and outputDirectory'
        });
    }

    try {
        const results = [];
        for (const file of csvFiles) {
            const filePath = path.join(outputDirectory, file);
            const data = await readCSV(filePath);
            const outputPath = path.join(outputDirectory, `processed_${file}`);
            writeCSV(data, outputPath);
            results.push({
                file,
                processedFile: `processed_${file}`
            });
        }
        return {
            success: true,
            results
        };
    } catch (error) {
        reply.status(500).send({
            error: `An error occurred while processing CSV files: ${error.message}`
        });
    }
});

// Start the server
const start = async () => {
    try {
        await fastify.listen({
            port: 3000,
        });
        fastify.log.info(`Server is running on port ${fastify.server.address().port}`);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();