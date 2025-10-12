// 代码生成时间: 2025-10-12 18:46:52
// telemedicine_platform.js
// 使用FASTIFY框架创建远程医疗平台的后端服务
// 包含患者注册、登录、问诊预约和医生信息管理功能

require('module-alias/register');

// 导入Fastify
const fastify = require('fastify')({
  logger: true
});

// 导入其他依赖
const { Patient, Doctor, Appointment } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 配置JWT密钥
const JWT_KEY = process.env.JWT_KEY || 'your-secret-key';

// 患者路由
fastify.register(async (app) => {
  // 注册患者
  app.post('/patients/register', async (request, reply) => {
    try {
      const { name, email, password } = request.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const patient = await Patient.create({ name, email, password: hashedPassword });
      reply.status(201).send({ message: 'Patient registered successfully', patient });
    } catch (error) {
      reply.status(500).send({ message: 'Error registering patient', error });
    }
  });

  // 患者登录
  app.post('/patients/login', async (request, reply) => {
    try {
      const { email, password } = request.body;
      const patient = await Patient.findOne({ where: { email } });
      if (!patient) {
        reply.status(404).send({ message: 'Patient not found' });
        return;
      }
      const isPasswordMatch = await bcrypt.compare(password, patient.password);
      if (!isPasswordMatch) {
        reply.status(401).send({ message: 'Incorrect password' });
        return;
      }
      const token = jwt.sign({ id: patient.id }, JWT_KEY, { expiresIn: '1h' });
      reply.send({ message: 'Patient logged in successfully', token, patient });
    } catch (error) {
      reply.status(500).send({ message: 'Error logging in patient', error });
    }
  });

  // 预约问诊
  app.post('/appointments', async (request, reply) => {
    try {
      const { patientId, doctorId, date } = request.body;
      const existingAppointment = await Appointment.findOne({
        where: { patientId, doctorId, date }
      });
      if (existingAppointment) {
        reply.status(400).send({ message: 'Appointment already exists' });
        return;
      }
      const appointment = await Appointment.create({ patientId, doctorId, date });
      reply.status(201).send({ message: 'Appointment scheduled successfully', appointment });
    } catch (error) {
      reply.status(500).send({ message: 'Error scheduling appointment', error });
    }
  });

});

// 医生路由
fastify.register(async (app) => {
  // 获取医生信息
  app.get('/doctors/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        reply.status(404).send({ message: 'Doctor not found' });
        return;
      }
      reply.send({ message: 'Doctor found', doctor });
    } catch (error) {
      reply.status(500).send({ message: 'Error retrieving doctor', error });
    }
  });

  // 更新医生信息
  app.patch('/doctors/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, specialty, availableDays } = request.body;
      const doctor = await Doctor.findByPk(id);
      if (!doctor) {
        reply.status(404).send({ message: 'Doctor not found' });
        return;
      }
      await doctor.update({ name, specialty, availableDays });
      reply.send({ message: 'Doctor updated successfully', doctor });
    } catch (error) {
      reply.status(500).send({ message: 'Error updating doctor', error });
    }
  });

});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info('Server is running on http://localhost:3000');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();