import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { authRegisterDto } from '../src/testing/auth-register-dto.mock';
import { Role } from '../src/enums/role.enum';
import dataSource from '../typeorm/data-source';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let userId: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(() => {
        app.close();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });

    it('Register new user', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send(authRegisterDto);

        expect(res.statusCode).toEqual(201);

        expect(typeof res.body.accessToken).toEqual('string');
    });

    it('Login with new user', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: authRegisterDto.email,
                password: authRegisterDto.password,
            });

        expect(res.statusCode).toEqual(201);
        expect(typeof res.body.accessToken).toEqual('string');

        accessToken = res.body.accessToken;
    });

    it('Get data to user logged', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/me')
            .set('Authorization', `bearer ${accessToken}`)
            .send();

        expect(res.statusCode).toEqual(201);
        expect(typeof res.body.id).toEqual('string');
        expect(res.body.role).toEqual(Role.User);
    });

    it('Register new user as administrator', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                ...authRegisterDto,
                role: Role.Admin,
                email: 'vitor@hotmail.com',
            });

        expect(res.statusCode).toEqual(201);

        expect(typeof res.body.accessToken).toEqual('string');

        accessToken = res.body.accessToken;
    });

    it('Validate if the function the new user is still User', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/me')
            .set('Authorization', `bearer ${accessToken}`)
            .send();

        expect(res.statusCode).toEqual(201);
        expect(typeof res.body.id).toEqual('string');
        expect(res.body.role).toEqual(Role.User);

        userId = res.body.id;
    });

    it('Try view user list', async () => {
        const res = await request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `bearer ${accessToken}`)
            .send();

        expect(res.statusCode).toEqual(403);
        expect(res.body.error).toEqual('Forbidden');
    });

    it('Changing manually the user for admin function', async () => {
        const ds = await dataSource.initialize();

        const QueryRunner = ds.createQueryRunner();

        await QueryRunner.query(`
        UPDATE users SET role = '${Role.Admin}' WHERE id = '${userId}'
    `);

        const rows = await QueryRunner.query(`
        SELECT * FROM users WHERE id = '${userId}'
    `);

        dataSource.destroy();

        expect(rows.length).toEqual(1);
        expect(rows[0].role).toEqual(Role.Admin);
    });

    it('Try view user list, now with access', async () => {
        const res = await request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `bearer ${accessToken}`)
            .send();

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
    });
});
