// 代码生成时间: 2025-09-24 00:57:38
const fastify = require('fastify')({ logger: true });
const axios = require('axios');
const cheerio = require('cheerio');

// 定义常量，用于配置抓取行为
const USER_AGENT = 'Mozilla/5.0 (compatible; MyScraper/1.0)';

// 抓取网页内容的异步函数
async function fetchPageContent(url) {
  try {
    // 使用axios发送HTTP请求
    const response = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch page: HTTP status ${response.status}`);
    }
  } catch (error) {
    // 错误处理
    throw new Error(`Error fetching page: ${error.message}`);
  }
}

// 解析网页内容并抓取数据的异步函数
async function scrapeContent(html) {
  try {
    const $ = cheerio.load(html);
    // 定义抓取规则，例如抓取所有段落
    const paragraphs = [];
    $('p').each(function () {
      paragraphs.push($(this).text().trim());
    });
    return paragraphs;
  } catch (error) {
    throw new Error(`Error scraping content: ${error.message}`);
  }
}

// 创建路由以处理网页内容抓取请求
fastify.post('/scrape', async (request, reply) => {
  const { url } = request.body;
  if (!url) {
    reply.status(400).send({
      error: 'URL is required',
    });
    return;
  }
  try {
    const html = await fetchPageContent(url);
    const content = await scrapeContent(html);
    reply.status(200).send({
      url: url,
      content: content,
    });
  } catch (error) {
    reply.status(500).send({
      error: error.message,
    });
  }
});

// 启动Fastify服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();