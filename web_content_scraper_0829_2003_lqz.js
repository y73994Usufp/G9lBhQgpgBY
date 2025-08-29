// 代码生成时间: 2025-08-29 20:03:17
const fastify = require('fastify')({ logger: true });
const axios = require('axios');
const cheerio = require('cheerio');

// 定义常量，用于存储基本配置
const PORT = 3000;
const HOST = '0.0.0.0';

// 定义抓取网页内容的函数
async function scrapeWebsiteContent(url) {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return cheerio.load(response.data);
    } else {
      throw new Error(`Failed to retrieve content. Status code: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Error scraping website: ${error.message}`);
  }
}

// 定义路由，用于抓取并返回网页内容
fastify.get('/scrape', async (request, reply) => {
  const { url } = request.query;
  
  if (!url) {
    reply.code(400).send({ error: 'URL parameter is required' });
    return;
  }
  
  try {
    const $ = await scrapeWebsiteContent(url);
    const content = $('body').html();
    reply.send({ content });
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
});

// 监听端口，启动服务器
fastify.listen(PORT, HOST, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});

// 模块化代码，便于维护和扩展
module.exports = {
  scrapeWebsiteContent,
  fastify
};