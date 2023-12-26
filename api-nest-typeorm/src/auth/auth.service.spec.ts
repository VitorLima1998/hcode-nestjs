import { accessToken } from './../testing/access-token.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { jwtServiceMock } from '../testing/jwt-service.mock';
import { userServiceMock } from '../testing/user-service.mock';
import { mailerServiceMock } from '../testing/mailer-service.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { jwtPayload } from '../testing/jwt-payload.mock';
import { resetToken } from '../testing/reset-token.mock';
import { authRegisterDto } from '../testing/auth-register-dto.mock';

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                userRepositoryMock,
                jwtServiceMock,
                userServiceMock,
                mailerServiceMock,
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    test('Validate definition', () => {
        expect(authService).toBeDefined();
    });

    describe('Token', () => {
        test('createToken method', async () => {
            const res = await authService.createToken(userEntityList[0]);

            expect(res).toEqual({ accessToken });
        });

        test('checkToken method', () => {
            const res = authService.checkToken(accessToken);

            expect(res).toEqual(jwtPayload);
        });

        test('isValidToken method', () => {
            const res = authService.isValidToken(accessToken);

            expect(res).toEqual(true);
        });
    });

    describe('Authentication', () => {
        test('Login method', async () => {
            const res = await authService.login(
                'vitor.lima@hotmail.com',
                '123456',
            );
            expect(res).toEqual({ accessToken });
        });

        test('forget method', async () => {
            const res = await authService.forget('vitor.lima@hotmail.com');
            expect(res).toEqual({ success: true });
        });

        test('reset method', async () => {
            const res = await authService.reset('P@$$w0rd', resetToken);
            expect(res).toEqual({ accessToken });
        });

        test('register method', async () => {
            const res = await authService.register(authRegisterDto);
            expect(res).toEqual({ accessToken });
        });
    });
});
