import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthGuard } from '../guards/auth.guard';
import { guardMock } from '../testing/guard.mock';
import { authServiceMock } from '../testing/auth-service.mock';
import { fileServiceMock } from '../testing/file-service.mock';
import { authLoginDto } from '../testing/auth-login-dto.mock';
import { accessToken } from '../testing/access-token.mock';
import { authRegisterDto } from '../testing/auth-register-dto.mock';
import { authForgetDto } from '../testing/auth-forget-dto.mock';
import { authResetDto } from '../testing/auth-reset-dto.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { getPhoto } from '../testing/get-photo.mock';

describe('AuthController', () => {
    let authContoller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [authServiceMock, fileServiceMock],
        })
            .overrideGuard(AuthGuard)
            .useValue(guardMock)
            .compile();

        authContoller = module.get<AuthController>(AuthController);
    });

    test('Validate Definition', () => {
        expect(authContoller).toBeDefined();
    });

    describe('Authentication flow', () => {
        test('login method', async () => {
            const res = await authContoller.login(authLoginDto);

            expect(res).toEqual({ accessToken });
        });

        test('register method', async () => {
            const res = await authContoller.register(authRegisterDto);

            expect(res).toEqual({ accessToken });
        });

        test('forget method', async () => {
            const res = await authContoller.forget(authForgetDto);

            expect(res).toEqual({ success: true });
        });
        test('reset method', async () => {
            const res = await authContoller.reset(authResetDto);

            expect(res).toEqual({ accessToken });
        });
    });

    describe('authenticated routes', () => {
        test('me method', async () => {
            const result = await authContoller.me(userEntityList[0]);
            expect(result).toEqual(userEntityList[0]);
        });

        test('uploadPhoto method', async () => {
            const photo = await getPhoto();
            const result = await authContoller.uploadPhoto(
                userEntityList[0],
                photo,
            );
            expect(result).toEqual(photo);
        });
    });
});
