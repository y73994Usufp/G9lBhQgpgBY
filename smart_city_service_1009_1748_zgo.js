// 代码生成时间: 2025-10-09 17:48:44
const fastify = require('fastify')({ logger: true });

// 模拟数据库
const database = {
  sensors: []
};

// 模拟传感器数据
function createSensorData() {
  return {
    id: Date.now(),
    temperature: Math.random() * 30,
    humidity: Math.random() * 100,
    timestamp: Date.now()
  };
}

// 添加传感器数据到数据库
function addSensorData(data) {
  database.sensors.push(data);
  return data;
}

// 获取所有传感器数据
function getAllSensorData() {
  return database.sensors;
}

// 创建API端点
fastify.post('/sensors', async (request, reply) => {
  try {
    // 检查请求体是否包含所需数据
    if (!request.body.temperature || !request.body.humidity) {
      reply.code(400).send({ error: 'Missing temperature or humidity data' });
      return;
    }

    // 创建传感器数据
    const sensorData = createSensorData();
    sensorData.temperature = request.body.temperature;
    sensorData.humidity = request.body.humidity;

    // 将数据添加到数据库
    const addedData = addSensorData(sensorData);

    // 返回添加的数据
    reply.code(201).send({ message: 'Sensor data added successfully', data: addedData });
  } catch (error) {
    // 错误处理
    reply.code(500).send({ error: error.message });
  }
});

// 获取传感器数据
fastify.get('/sensors', async (request, reply) => {
  try {
    // 获取所有传感器数据
    const sensorData = getAllSensorData();

    // 返回传感器数据
    reply.send({ message: 'Sensor data retrieved successfully', data: sensorData });
  } catch (error) {
    // 错误处理
    reply.code(500).send({ error: error.message });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Server listening on port ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// 导出Fastify实例
module.exports = fastify;