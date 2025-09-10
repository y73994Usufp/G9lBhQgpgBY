// 代码生成时间: 2025-09-10 13:31:39
const fastify = require('fastify')({ logger: true });

// 定义进程管理器类
class ProcessManager {
  constructor() {
    this.processes = [];
  }

  // 添加进程
  addProcess(processId, processName) {
    this.processes.push({ processId, processName });
    return { success: true, message: `Process ${processName} added successfully.` };
  }

  // 获取所有进程
  getAllProcesses() {
    return { success: true, data: this.processes };
  }

  // 根据进程ID获取进程信息
  getProcessById(processId) {
    const process = this.processes.find(p => p.processId === processId);
    if (!process) {
      return { success: false, message: 'Process not found.' };
    }
    return { success: true, data: process };
  }

  // 根据进程ID终止进程
  terminateProcess(processId) {
    const index = this.processes.findIndex(p => p.processId === processId);
    if (index === -1) {
      return { success: false, message: 'Process not found.' };
    }
    this.processes.splice(index, 1);
    return { success: true, message: `Process ${processId} terminated successfully.` };
  }
}

// 创建进程管理器实例
const manager = new ProcessManager();

// 定义路由
fastify.post('/processes', async (request, reply) => {
  try {
    const { processId, processName } = request.body;
    const result = manager.addProcess(processId, processName);
    reply.code(200).send(result);
  } catch (error) {
    reply.code(500).send({ success: false, message: error.message });
  }
});

fastify.get('/processes', async (request, reply) => {
  try {
    const result = manager.getAllProcesses();
    reply.code(200).send(result);
  } catch (error) {
    reply.code(500).send({ success: false, message: error.message });
  }
});

fastify.get('/processes/:processId', async (request, reply) => {
  try {
    const { processId } = request.params;
    const result = manager.getProcessById(processId);
    if (result.success) {
      reply.code(200).send(result);
    } else {
      reply.code(404).send(result);
    }
  } catch (error) {
    reply.code(500).send({ success: false, message: error.message });
  }
});

fastify.delete('/processes/:processId', async (request, reply) => {
  try {
    const { processId } = request.params;
    const result = manager.terminateProcess(processId);
    if (result.success) {
      reply.code(200).send(result);
    } else {
      reply.code(404).send(result);
    }
  } catch (error) {
    reply.code(500).send({ success: false, message: error.message });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();