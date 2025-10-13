// 代码生成时间: 2025-10-13 22:02:55
const fastify = require('fastify')({ logger: true });

// 引入蓝牙设备通信模块
const noble = require('noble');

// 蓝牙设备信息
const deviceInfo = {
  // 假设这里是设备的具体信息
  address: 'xx:xx:xx:xx:xx:xx',
  uuid: 'xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
};

// 蓝牙设备连接状态
let isConnected = false;

// 蓝牙设备服务和特性
let service, characteristic;

// 蓝牙设备数据接收缓存
let dataBuffer = Buffer.alloc(0);

// 启动蓝牙模块
noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

// 扫描到蓝牙设备
noble.on('discover', async (peripheral) => {
  if (peripheral.address === deviceInfo.address) {
    await fastify.log.info(`Found device: ${peripheral.id}, connecting...`);
    await peripheral.connectAsync();
    await peripheral.discoverServicesAsync([deviceInfo.uuid]);
    service = peripheral.services[0];
    characteristic = service.characteristics[0];
    await characteristic.subscribe(function(error, value) {
      if (error) {
        fastify.log.error('Subscribe to characteristic failed:', error);
      } else {
        fastify.log.info('Subscribed to characteristic successfully.');
        dataBuffer = Buffer.concat([dataBuffer, value]);
        // 处理接收到的数据
        processData();
      }
    });
  }
});

// 处理接收到的数据
function processData() {
  // 假设数据格式是JSON
  try {
    const data = JSON.parse(dataBuffer.toString('utf-8'));
    // 处理数据...
    fastify.log.info('Data received:', data);
  } catch (error) {
    fastify.log.error('Failed to parse data:', error);
  }
}

// 创建一个路由，用于发送数据到蓝牙设备
fastify.post('/send-data', async (request, reply) => {
  try {
    const { data } = request.body;
    if (isConnected && characteristic) {
      await characteristic.write(Buffer.from(data), false);
      fastify.log.info('Data sent:', data);
    } else {
      reply.status(503).send({ error: 'Bluetooth device is not connected.' });
    }
  } catch (error) {
    fastify.log.error('Failed to send data:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// 开启服务器
async function startServer() {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info('Server listening on port 3000');
  } catch (error) {
    fastify.log.error('Failed to start server:', error);
  }
}

startServer();