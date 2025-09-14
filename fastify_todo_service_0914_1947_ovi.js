// 代码生成时间: 2025-09-14 19:47:33
const fastify = require('fastify')({ logger: true });

// 数据模型设计
// 使用简单的JavaScript对象模拟数据库
let todos = [];

// Todo 数据模型
class Todo {
  constructor(id, title, completed = false) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }
}

// 注册 Todo 路由
fastify.register(async (app) => {
  // 获取所有 Todo
  app.get('/todos', async (request, reply) => {
    try {
      reply.send(todos);
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });

  // 获取单个 Todo
  app.get('/todos/:id', async (request, reply) => {
    const { id } = request.params;
    const todo = todos.find(todo => todo.id === parseInt(id));
    if (!todo) {
      reply.status(404).send({ error: 'Todo not found' });
    } else {
      reply.send(todo);
    }
  });

  // 创建新 Todo
  app.post('/todos', async (request, reply) => {
    const { title } = request.body;
    if (!title) {
      reply.status(400).send({ error: 'Title is required' });
      return;
    }
    const newTodo = new Todo(todos.length + 1, title);
    todos.push(newTodo);
    reply.code(201).send(newTodo);
  });

  // 更新 Todo
  app.put('/todos/:id', async (request, reply) => {
    const { id } = request.params;
    const { title, completed } = request.body;
    const todo = todos.find(todo => todo.id === parseInt(id));
    if (!todo) {
      reply.status(404).send({ error: 'Todo not found' });
    } else {
      todo.title = title;
      todo.completed = completed;
      reply.send(todo);
    }
  });

  // 删除 Todo
  app.delete('/todos/:id', async (request, reply) => {
    const { id } = request.params;
    const index = todos.findIndex(todo => todo.id === parseInt(id));
    if (index === -1) {
      reply.status(404).send({ error: 'Todo not found' });
    } else {
      todos.splice(index, 1);
      reply.send({ message: 'Todo deleted' });
    }
  });
});

// 错误处理
fastify.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode).send({
    error: error.message
  });
});

// 服务器启动
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();