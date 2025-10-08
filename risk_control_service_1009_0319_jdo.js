// 代码生成时间: 2025-10-09 03:19:23
const fastify = require('fastify')({ logger: true });

// 风险控制系统服务
class RiskControlService {
  // 构造函数
  constructor() {
    this.rules = []; // 存放风险控制规则
  }

  // 添加规则
  addRule(rule) {
    this.rules.push(rule);
  }

  // 检查风险
  checkRisk(data) {
    for (const rule of this.rules) {
      if (!rule(data)) {
        throw new Error('Risk detected');
      }
    }
  }
}

// 创建风险控制系统实例
const riskControlService = new RiskControlService();

// 定义风险控制规则
function highValueTransactionRule(data) {
  // 假设超过10000元视为高风险交易
  return data.amount <= 10000;
}

function suspiciousActivityRule(data) {
  // 假设同一用户一天内超过3次交易视为可疑活动
  return data.user.transactions.length <= 3;
}

// 添加规则到风险控制系统
riskControlService.addRule(highValueTransactionRule);
riskControlService.addRule(suspiciousActivityRule);

// 创建一个交易对象用于测试
const transaction = {
  amount: 5000,
  user: { transactions: [] }
};

// 测试交易是否通过风险控制检查
try {
  riskControlService.checkRisk(transaction);
  console.log('Transaction passed risk control check');
} catch (error) {
  console.error(error.message);
}

// 暴露一个POST接口，用于提交交易数据进行风险控制检查
fastify.post('/check-risk', async (request, reply) => {
  try {
    const { amount, userId } = request.body;
    // 假设有一个函数getTransactions可以获取用户的所有交易记录
    const transactions = await getTransactions(userId);
    const data = { amount, user: { transactions } };
    await riskControlService.checkRisk(data);
    reply.send({ message: 'Transaction passed risk control check' });
  } catch (error) {
    reply.status(400).send({
      message: error.message
    });
  }
});

// 假设的getTransactions函数
async function getTransactions(userId) {
  // 这里应该是数据库查询逻辑，返回用户的所有交易记录
  // 为了演示，我们返回一个空数组
  return [];
}

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on port ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();