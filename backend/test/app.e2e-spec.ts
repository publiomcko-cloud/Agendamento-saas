import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';

type LoginResponseBody = {
  accessToken: string;
  user: {
    id: string;
    name?: string;
    email: string;
    role: string;
    active?: boolean;
  };
};

type UserResponseBody = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

type ClientResponseBody = {
  id: string;
  name: string;
  active: boolean;
  phone?: string;
  userId?: string | null;
};

type ServiceResponseBody = {
  id: string;
  name: string;
  active: boolean;
  durationMinutes: number;
  price: string;
};

type AppointmentResponseBody = {
  id: string;
  clientId: string;
  serviceId: string;
  status: string;
  scheduledAt: string;
  endAt: string;
};

type PaymentResponseBody = {
  id: string;
  appointmentId: string;
  amount: string;
  status: string;
  method?: string | null;
  paidAt?: string | null;
};

type DashboardResponseBody = {
  referenceDate: string;
  totals: {
    appointmentsToday: number;
    paymentsToday: number;
    revenuePaidToday: string;
  };
  appointmentsToday: AppointmentResponseBody[];
  upcomingAppointments: AppointmentResponseBody[];
};

type ErrorResponseBody = {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error: string;
};

describe('Auth flow (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: 'ok',
            service: 'backend',
          }),
        );
      });
  });

  it('/api/auth/login (POST) should authenticate the seeded admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const body = response.body as LoginResponseBody;

    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
    expect(body.user.email).toBe('admin@example.com');
    expect(body.user.role).toBe('admin');
  });

  it('/api/auth/login (POST) should reject invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'senha-incorreta',
      })
      .expect(401);
  });

  it('/api/auth/login (POST) should return a standardized validation error payload', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'nao-e-email',
      })
      .expect(400);
    const body = response.body as ErrorResponseBody;

    expect(body).toEqual(
      expect.objectContaining({
        statusCode: 400,
        method: 'POST',
        path: '/api/auth/login',
        error: 'Bad Request',
      }),
    );
    expect(typeof body.timestamp).toBe('string');
    expect(typeof body.message).toBe('string');
  });

  it('/api/users/me (GET) should require a valid bearer token', () => {
    return request(app.getHttpServer()).get('/api/users/me').expect(401);
  });

  it('/api/users/admin-only (GET) should block a client user', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'client@example.com',
        password: 'Client@123456',
      })
      .expect(200);
    const body = loginResponse.body as LoginResponseBody;

    return request(app.getHttpServer())
      .get('/api/users/admin-only')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(403);
  });

  it('/api/users (POST/GET/PATCH) should let an admin manage users', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const body = loginResponse.body as LoginResponseBody;

    const createdResponse = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .send({
        name: 'Atendente Fase 1',
        email: `atendente-fase1-${Date.now()}@example.com`,
        role: 'attendant',
        password: 'Atendente@123456',
      })
      .expect(201);
    const createdUser = createdResponse.body as UserResponseBody;

    expect(createdUser.name).toBe('Atendente Fase 1');
    expect(createdUser.active).toBe(true);

    const listResponse = await request(app.getHttpServer())
      .get(`/api/users?search=${encodeURIComponent(createdUser.email)}`)
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(200);
    const listedUsers = listResponse.body as UserResponseBody[];

    expect(listedUsers.some((user) => user.email === createdUser.email)).toBe(
      true,
    );

    const updatedResponse = await request(app.getHttpServer())
      .patch(`/api/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${body.accessToken}`)
      .send({
        name: 'Atendente Atualizado',
        role: 'admin',
      })
      .expect(200);
    const updatedUser = updatedResponse.body as UserResponseBody;

    expect(updatedUser.name).toBe('Atendente Atualizado');
    expect(updatedUser.role).toBe('admin');

    const deactivatedResponse = await request(app.getHttpServer())
      .patch(`/api/users/${createdUser.id}/deactivate`)
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(200);
    const deactivatedUser = deactivatedResponse.body as UserResponseBody;

    expect(deactivatedUser.active).toBe(false);

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: createdUser.email,
        password: 'Atendente@123456',
      })
      .expect(401);

    const activatedResponse = await request(app.getHttpServer())
      .patch(`/api/users/${createdUser.id}/activate`)
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(200);
    const activatedUser = activatedResponse.body as UserResponseBody;

    expect(activatedUser.active).toBe(true);
  });

  it('/api/users (GET) should block an attendant user', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'attendant@example.com',
        password: 'Attendant@123456',
      })
      .expect(200);
    const body = loginResponse.body as LoginResponseBody;

    await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(403);
  });

  it('/api/clients (POST) should create a client for admin', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const body = loginResponse.body as LoginResponseBody;

    const response = await request(app.getHttpServer())
      .post('/api/clients')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .send({
        name: 'Cliente Fase 3 Admin',
        email: `cliente-admin-${Date.now()}@example.com`,
        phone: '+5511999990001',
        notes: 'Criado no teste de integracao.',
      })
      .expect(201);
    const createdClient = response.body as ClientResponseBody;

    expect(createdClient.name).toBe('Cliente Fase 3 Admin');
    expect(createdClient.active).toBe(true);
  });

  it('/api/clients (GET) should allow an attendant to list clients', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'attendant@example.com',
        password: 'Attendant@123456',
      })
      .expect(200);
    const body = loginResponse.body as LoginResponseBody;

    const response = await request(app.getHttpServer())
      .get('/api/clients')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/api/clients/:id (PATCH) should update and deactivate a client', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const body = loginResponse.body as LoginResponseBody;

    const createdClient = await request(app.getHttpServer())
      .post('/api/clients')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .send({
        name: 'Cliente Editavel',
        email: `cliente-edit-${Date.now()}@example.com`,
      })
      .expect(201);
    const createdClientBody = createdClient.body as ClientResponseBody;

    const updatedClient = await request(app.getHttpServer())
      .patch(`/api/clients/${createdClientBody.id}`)
      .set('Authorization', `Bearer ${body.accessToken}`)
      .send({
        phone: '+5511999990002',
        notes: 'Atualizado no teste.',
      })
      .expect(200);
    const updatedClientBody = updatedClient.body as ClientResponseBody;

    expect(updatedClientBody.phone).toBe('+5511999990002');

    const deactivatedClient = await request(app.getHttpServer())
      .patch(`/api/clients/${createdClientBody.id}/deactivate`)
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(200);
    const deactivatedClientBody = deactivatedClient.body as ClientResponseBody;

    expect(deactivatedClientBody.active).toBe(false);
  });

  it('/api/clients (GET) should block a client user', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'client@example.com',
        password: 'Client@123456',
      })
      .expect(200);
    const body = loginResponse.body as LoginResponseBody;

    return request(app.getHttpServer())
      .get('/api/clients')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(403);
  });

  it('/api/services (POST) should create a service for admin', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const body = loginResponse.body as LoginResponseBody;

    const response = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .send({
        name: 'Corte Executivo',
        description: 'Servico criado no teste.',
        durationMinutes: 45,
        price: 79.9,
      })
      .expect(201);
    const createdService = response.body as ServiceResponseBody;

    expect(createdService.name).toBe('Corte Executivo');
    expect(createdService.active).toBe(true);
    expect(createdService.durationMinutes).toBe(45);
  });

  it('/api/services (GET) should allow an attendant to list services', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'attendant@example.com',
        password: 'Attendant@123456',
      })
      .expect(200);
    const body = loginResponse.body as LoginResponseBody;

    const response = await request(app.getHttpServer())
      .get('/api/services')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/api/services (GET) should allow a client to list only active services', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const adminBody = adminLogin.body as LoginResponseBody;

    await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: `Servico Ativo Cliente ${Date.now()}`,
        durationMinutes: 30,
        price: 50,
      })
      .expect(201);

    const inactiveResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: `Servico Inativo Cliente ${Date.now()}`,
        durationMinutes: 40,
        price: 70,
      })
      .expect(201);
    const inactiveService = inactiveResponse.body as ServiceResponseBody;

    await request(app.getHttpServer())
      .patch(`/api/services/${inactiveService.id}/deactivate`)
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .expect(200);

    const clientLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'client@example.com',
        password: 'Client@123456',
      })
      .expect(200);
    const clientBody = clientLogin.body as LoginResponseBody;

    const response = await request(app.getHttpServer())
      .get('/api/services')
      .set('Authorization', `Bearer ${clientBody.accessToken}`)
      .expect(200);
    const services = response.body as ServiceResponseBody[];

    expect(services.every((service) => service.active)).toBe(true);
    expect(services.some((service) => service.id === inactiveService.id)).toBe(
      false,
    );
  });

  it('/api/services/:id (PATCH) should update, deactivate and activate a service', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const body = loginResponse.body as LoginResponseBody;

    const createdResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .send({
        name: 'Barba Completa',
        durationMinutes: 30,
        price: 39.9,
      })
      .expect(201);
    const createdService = createdResponse.body as ServiceResponseBody;

    const updatedResponse = await request(app.getHttpServer())
      .patch(`/api/services/${createdService.id}`)
      .set('Authorization', `Bearer ${body.accessToken}`)
      .send({
        price: 44.9,
        durationMinutes: 35,
      })
      .expect(200);
    const updatedService = updatedResponse.body as ServiceResponseBody;

    expect(updatedService.price).toBe('44.9');
    expect(updatedService.durationMinutes).toBe(35);

    const deactivatedResponse = await request(app.getHttpServer())
      .patch(`/api/services/${createdService.id}/deactivate`)
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(200);
    const deactivatedService = deactivatedResponse.body as ServiceResponseBody;

    expect(deactivatedService.active).toBe(false);

    const activatedResponse = await request(app.getHttpServer())
      .patch(`/api/services/${createdService.id}/activate`)
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(200);
    const activatedService = activatedResponse.body as ServiceResponseBody;

    expect(activatedService.active).toBe(true);
  });

  it('/api/services (POST) should block an attendant from managing services', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'attendant@example.com',
        password: 'Attendant@123456',
      })
      .expect(200);
    const body = loginResponse.body as LoginResponseBody;

    return request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .send({
        name: 'Servico Bloqueado',
        durationMinutes: 20,
        price: 25,
      })
      .expect(403);
  });

  it('/api/appointments (POST) should create an appointment and calculate endAt', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const adminBody = adminLogin.body as LoginResponseBody;

    const clientResponse = await request(app.getHttpServer())
      .post('/api/clients')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Cliente Agendamento',
        email: `cliente-agendamento-${Date.now()}@example.com`,
      })
      .expect(201);
    const clientBody = clientResponse.body as ClientResponseBody;

    const serviceResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Servico Agendamento',
        durationMinutes: 60,
        price: 120,
      })
      .expect(201);
    const serviceBody = serviceResponse.body as ServiceResponseBody;

    const appointmentResponse = await request(app.getHttpServer())
      .post('/api/appointments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        clientId: clientBody.id,
        serviceId: serviceBody.id,
        scheduledAt: '2026-05-01T14:00:00.000Z',
      })
      .expect(201);
    const appointmentBody = appointmentResponse.body as AppointmentResponseBody;

    expect(appointmentBody.status).toBe('scheduled');
    expect(appointmentBody.scheduledAt).toBe('2026-05-01T14:00:00.000Z');
    expect(appointmentBody.endAt).toBe('2026-05-01T15:00:00.000Z');
  });

  it('/api/appointments (POST) should block conflicting appointments', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const adminBody = adminLogin.body as LoginResponseBody;

    const clientResponse = await request(app.getHttpServer())
      .post('/api/clients')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Cliente Conflito',
        email: `cliente-conflito-${Date.now()}@example.com`,
      })
      .expect(201);
    const clientBody = clientResponse.body as ClientResponseBody;

    const serviceResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Servico Conflito',
        durationMinutes: 45,
        price: 80,
      })
      .expect(201);
    const serviceBody = serviceResponse.body as ServiceResponseBody;

    await request(app.getHttpServer())
      .post('/api/appointments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        clientId: clientBody.id,
        serviceId: serviceBody.id,
        scheduledAt: '2026-05-02T10:00:00.000Z',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/appointments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        clientId: clientBody.id,
        serviceId: serviceBody.id,
        scheduledAt: '2026-05-02T10:30:00.000Z',
      })
      .expect(409);
  });

  it('/api/appointments (GET) should allow a client to list only their own appointments', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const adminBody = adminLogin.body as LoginResponseBody;

    const clientLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'client@example.com',
        password: 'Client@123456',
      })
      .expect(200);
    const clientUserBody = clientLogin.body as LoginResponseBody;

    const myProfileResponse = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${clientUserBody.accessToken}`)
      .expect(200);
    const currentUser = myProfileResponse.body as LoginResponseBody['user'];

    const listMyClientResponse = await request(app.getHttpServer())
      .get('/api/clients')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .expect(200);
    const allClients = listMyClientResponse.body as ClientResponseBody[];
    const myClient = allClients.find(
      (client) => client.userId === currentUser.id,
    );

    expect(myClient).toBeDefined();

    const serviceResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: `Servico Cliente ${Date.now()}`,
        durationMinutes: 30,
        price: 60,
      })
      .expect(201);
    const serviceBody = serviceResponse.body as ServiceResponseBody;
    const uniqueDayOffset = Math.floor(Date.now() / 1000) % 10000;
    const uniqueScheduledAt = new Date(
      Date.UTC(2050, 0, 1 + uniqueDayOffset, 9, 0, 0, 0),
    ).toISOString();

    await request(app.getHttpServer())
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientUserBody.accessToken}`)
      .send({
        clientId: myClient!.id,
        serviceId: serviceBody.id,
        scheduledAt: uniqueScheduledAt,
      })
      .expect(201);

    const appointmentsResponse = await request(app.getHttpServer())
      .get('/api/appointments')
      .set('Authorization', `Bearer ${clientUserBody.accessToken}`)
      .expect(200);
    const appointments = appointmentsResponse.body as AppointmentResponseBody[];

    expect(
      appointments.every(
        (appointment) => appointment.clientId === myClient!.id,
      ),
    ).toBe(true);
  });

  it('/api/appointments (POST) should allow a client to create without sending clientId', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const adminBody = adminLogin.body as LoginResponseBody;

    const serviceResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: `Servico Self Booking ${Date.now()}`,
        durationMinutes: 30,
        price: 65,
      })
      .expect(201);
    const serviceBody = serviceResponse.body as ServiceResponseBody;

    const clientLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'client@example.com',
        password: 'Client@123456',
      })
      .expect(200);
    const clientBody = clientLogin.body as LoginResponseBody;

    const uniqueDayOffset = (Math.floor(Date.now() / 1000) % 10000) + 15000;
    const uniqueScheduledAt = new Date(
      Date.UTC(2055, 0, 1 + uniqueDayOffset, 13, 0, 0, 0),
    ).toISOString();

    const appointmentResponse = await request(app.getHttpServer())
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientBody.accessToken}`)
      .send({
        serviceId: serviceBody.id,
        scheduledAt: uniqueScheduledAt,
      })
      .expect(201);
    const appointmentBody = appointmentResponse.body as AppointmentResponseBody;

    expect(appointmentBody.serviceId).toBe(serviceBody.id);
    expect(appointmentBody.status).toBe('scheduled');
  });

  it('/api/appointments/:id/reschedule and /cancel should update the appointment', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const adminBody = adminLogin.body as LoginResponseBody;

    const clientResponse = await request(app.getHttpServer())
      .post('/api/clients')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Cliente Reagendamento',
        email: `cliente-reagenda-${Date.now()}@example.com`,
      })
      .expect(201);
    const clientBody = clientResponse.body as ClientResponseBody;

    const serviceResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Servico Reagendamento',
        durationMinutes: 30,
        price: 50,
      })
      .expect(201);
    const serviceBody = serviceResponse.body as ServiceResponseBody;

    const appointmentResponse = await request(app.getHttpServer())
      .post('/api/appointments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        clientId: clientBody.id,
        serviceId: serviceBody.id,
        scheduledAt: '2026-05-04T11:00:00.000Z',
      })
      .expect(201);
    const appointmentBody = appointmentResponse.body as AppointmentResponseBody;

    const rescheduledResponse = await request(app.getHttpServer())
      .patch(`/api/appointments/${appointmentBody.id}/reschedule`)
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        scheduledAt: '2026-05-04T12:00:00.000Z',
        notes: 'Reagendado no teste.',
      })
      .expect(200);
    const rescheduledBody = rescheduledResponse.body as AppointmentResponseBody;

    expect(rescheduledBody.scheduledAt).toBe('2026-05-04T12:00:00.000Z');
    expect(rescheduledBody.endAt).toBe('2026-05-04T12:30:00.000Z');

    const cancelledResponse = await request(app.getHttpServer())
      .patch(`/api/appointments/${appointmentBody.id}/cancel`)
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .expect(200);
    const cancelledBody = cancelledResponse.body as AppointmentResponseBody;

    expect(cancelledBody.status).toBe('cancelled');
  });

  it('/api/payments (POST) should register a payment for an appointment', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const adminBody = adminLogin.body as LoginResponseBody;

    const clientResponse = await request(app.getHttpServer())
      .post('/api/clients')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Cliente Pagamento',
        email: `cliente-pagamento-${Date.now()}@example.com`,
      })
      .expect(201);
    const clientBody = clientResponse.body as ClientResponseBody;

    const serviceResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Servico Pagamento',
        durationMinutes: 30,
        price: 90,
      })
      .expect(201);
    const serviceBody = serviceResponse.body as ServiceResponseBody;

    const appointmentResponse = await request(app.getHttpServer())
      .post('/api/appointments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        clientId: clientBody.id,
        serviceId: serviceBody.id,
        scheduledAt: '2026-05-07T10:00:00.000Z',
      })
      .expect(201);
    const appointmentBody = appointmentResponse.body as AppointmentResponseBody;

    const paymentResponse = await request(app.getHttpServer())
      .post('/api/payments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        appointmentId: appointmentBody.id,
        amount: 90,
        status: 'paid',
        method: 'pix',
        paidAt: '2026-05-07T10:35:00.000Z',
      })
      .expect(201);
    const paymentBody = paymentResponse.body as PaymentResponseBody;

    expect(paymentBody.appointmentId).toBe(appointmentBody.id);
    expect(paymentBody.amount).toBe('90');
    expect(paymentBody.status).toBe('paid');
    expect(paymentBody.method).toBe('pix');
  });

  it('/api/payments (POST) should block payments for cancelled appointments', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const adminBody = adminLogin.body as LoginResponseBody;

    const clientResponse = await request(app.getHttpServer())
      .post('/api/clients')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Cliente Pagamento Cancelado',
        email: `cliente-pagamento-cancelado-${Date.now()}@example.com`,
      })
      .expect(201);
    const clientBody = clientResponse.body as ClientResponseBody;

    const serviceResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Servico Pagamento Cancelado',
        durationMinutes: 20,
        price: 30,
      })
      .expect(201);
    const serviceBody = serviceResponse.body as ServiceResponseBody;

    const appointmentResponse = await request(app.getHttpServer())
      .post('/api/appointments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        clientId: clientBody.id,
        serviceId: serviceBody.id,
        scheduledAt: '2026-05-08T11:00:00.000Z',
      })
      .expect(201);
    const appointmentBody = appointmentResponse.body as AppointmentResponseBody;

    await request(app.getHttpServer())
      .patch(`/api/appointments/${appointmentBody.id}/cancel`)
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/payments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        appointmentId: appointmentBody.id,
        amount: 30,
        status: 'paid',
        method: 'cash',
        paidAt: '2026-05-08T11:30:00.000Z',
      })
      .expect(409);
  });

  it('/api/payments (POST) should require paidAt when status is paid', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const adminBody = adminLogin.body as LoginResponseBody;

    const clientResponse = await request(app.getHttpServer())
      .post('/api/clients')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Cliente Pagamento Sem Data',
        email: `cliente-pagamento-sem-data-${Date.now()}@example.com`,
      })
      .expect(201);
    const clientBody = clientResponse.body as ClientResponseBody;

    const serviceResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Servico Pagamento Sem Data',
        durationMinutes: 25,
        price: 45,
      })
      .expect(201);
    const serviceBody = serviceResponse.body as ServiceResponseBody;

    const appointmentResponse = await request(app.getHttpServer())
      .post('/api/appointments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        clientId: clientBody.id,
        serviceId: serviceBody.id,
        scheduledAt: '2026-05-12T15:00:00.000Z',
      })
      .expect(201);
    const appointmentBody = appointmentResponse.body as AppointmentResponseBody;

    await request(app.getHttpServer())
      .post('/api/payments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        appointmentId: appointmentBody.id,
        amount: 45,
        status: 'paid',
        method: 'pix',
      })
      .expect(409);
  });

  it('/api/payments/:id (PATCH) should update payment status', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const adminBody = adminLogin.body as LoginResponseBody;

    const clientResponse = await request(app.getHttpServer())
      .post('/api/clients')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Cliente Atualiza Pagamento',
        email: `cliente-atualiza-pagamento-${Date.now()}@example.com`,
      })
      .expect(201);
    const clientBody = clientResponse.body as ClientResponseBody;

    const serviceResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Servico Atualiza Pagamento',
        durationMinutes: 25,
        price: 70,
      })
      .expect(201);
    const serviceBody = serviceResponse.body as ServiceResponseBody;

    const appointmentResponse = await request(app.getHttpServer())
      .post('/api/appointments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        clientId: clientBody.id,
        serviceId: serviceBody.id,
        scheduledAt: '2026-05-09T12:00:00.000Z',
      })
      .expect(201);
    const appointmentBody = appointmentResponse.body as AppointmentResponseBody;

    const paymentResponse = await request(app.getHttpServer())
      .post('/api/payments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        appointmentId: appointmentBody.id,
        amount: 70,
        status: 'pending',
      })
      .expect(201);
    const paymentBody = paymentResponse.body as PaymentResponseBody;

    const updatedPaymentResponse = await request(app.getHttpServer())
      .patch(`/api/payments/${paymentBody.id}`)
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        status: 'paid',
        method: 'credit_card',
        paidAt: '2026-05-09T12:40:00.000Z',
      })
      .expect(200);
    const updatedPaymentBody =
      updatedPaymentResponse.body as PaymentResponseBody;

    expect(updatedPaymentBody.status).toBe('paid');
    expect(updatedPaymentBody.method).toBe('credit_card');
    expect(updatedPaymentBody.paidAt).toBe('2026-05-09T12:40:00.000Z');
  });

  it('/api/payments (GET) should allow a client to list only their own payments', async () => {
    const clientLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'client@example.com',
        password: 'Client@123456',
      })
      .expect(200);
    const clientBody = clientLogin.body as LoginResponseBody;

    const response = await request(app.getHttpServer())
      .get('/api/payments')
      .set('Authorization', `Bearer ${clientBody.accessToken}`)
      .expect(200);
    const payments = response.body as PaymentResponseBody[];

    expect(Array.isArray(payments)).toBe(true);
  });

  it('/api/dashboard (GET) should return operational totals for admin', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      .expect(200);
    const adminBody = adminLogin.body as LoginResponseBody;

    const clientResponse = await request(app.getHttpServer())
      .post('/api/clients')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Cliente Dashboard',
        email: `cliente-dashboard-${Date.now()}@example.com`,
      })
      .expect(201);
    const clientBody = clientResponse.body as ClientResponseBody;

    const serviceResponse = await request(app.getHttpServer())
      .post('/api/services')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        name: 'Servico Dashboard',
        durationMinutes: 30,
        price: 100,
      })
      .expect(201);
    const serviceBody = serviceResponse.body as ServiceResponseBody;

    const appointmentResponse = await request(app.getHttpServer())
      .post('/api/appointments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        clientId: clientBody.id,
        serviceId: serviceBody.id,
        scheduledAt: '2026-05-11T09:00:00.000Z',
      })
      .expect(201);
    const appointmentBody = appointmentResponse.body as AppointmentResponseBody;

    await request(app.getHttpServer())
      .post('/api/payments')
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .send({
        appointmentId: appointmentBody.id,
        amount: 100,
        status: 'paid',
        method: 'pix',
        paidAt: '2026-05-11T09:35:00.000Z',
      })
      .expect(201);

    const dashboardResponse = await request(app.getHttpServer())
      .get('/api/dashboard')
      .query({ referenceDate: '2026-05-11T00:00:00.000Z' })
      .set('Authorization', `Bearer ${adminBody.accessToken}`)
      .expect(200);
    const dashboardBody = dashboardResponse.body as DashboardResponseBody;

    expect(dashboardBody.totals.appointmentsToday).toBeGreaterThanOrEqual(1);
    expect(dashboardBody.totals.paymentsToday).toBeGreaterThanOrEqual(1);
    expect(
      Number(dashboardBody.totals.revenuePaidToday),
    ).toBeGreaterThanOrEqual(100);
    expect(Array.isArray(dashboardBody.appointmentsToday)).toBe(true);
    expect(Array.isArray(dashboardBody.upcomingAppointments)).toBe(true);
  });

  it('/api/dashboard (GET) should block a client user', async () => {
    const clientLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'client@example.com',
        password: 'Client@123456',
      })
      .expect(200);
    const clientBody = clientLogin.body as LoginResponseBody;

    await request(app.getHttpServer())
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${clientBody.accessToken}`)
      .expect(403);
  });

  it('/api/dashboard (GET) should allow an attendant user', async () => {
    const attendantLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'attendant@example.com',
        password: 'Attendant@123456',
      })
      .expect(200);
    const attendantBody = attendantLogin.body as LoginResponseBody;

    const response = await request(app.getHttpServer())
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${attendantBody.accessToken}`)
      .expect(200);
    const dashboardBody = response.body as DashboardResponseBody;

    expect(typeof dashboardBody.totals.appointmentsToday).toBe('number');
    expect(typeof dashboardBody.totals.paymentsToday).toBe('number');
  });

  afterEach(async () => {
    await app.close();
  });
});
