import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { userServiceMock } from '../testing/user-service.mock';
import { AuthGuard } from '../guards/auth.guard';
import { guardMock } from '../testing/guard.mock';
import { RoleGuard } from '../guards/role.guard';
import { UserService } from './user.service';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { updateUserDTO } from '../testing/update-put-user-dto.mock';
import { updatePatchUserDTO } from '../testing/update-patch-user-dto.mock';

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [userServiceMock],
        })
            .overrideGuard(AuthGuard)
            .useValue(guardMock)
            .overrideGuard(RoleGuard)
            .useValue(guardMock)
            .compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    test('Validate definition', () => {
        expect(userController).toBeDefined();
        expect(userService).toBeDefined();
    });

    describe('guard applications test in this controller', () => {
        test('If guards has been applicated', () => {
            const guards = Reflect.getMetadata('__guards__', UserController);

            expect(guards.length).toEqual(2);
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
            expect(new guards[1]()).toBeInstanceOf(RoleGuard);
        });
    });

    describe('Create', () => {
        test('createMethod', async () => {
            const res = await userController.create(createUserDTO);
            expect(res).toEqual(userEntityList[0]);
        });

        test('findAllMethod', async () => {
            const res = await userController.read();
            expect(res).toEqual(userEntityList);
        });

        test('findOneMethod', async () => {
            const res = await userController.readOne(
                'e5b7bc0e-707d-4cd3-a0a9-a292adbffe3d',
            );
            expect(res).toEqual(userEntityList[0]);
        });

        test('updateMethod', async () => {
            const res = await userController.update(
                updateUserDTO,
                'e5b7bc0e-707d-4cd3-a0a9-a292adbffe3d',
            );
            expect(res).toEqual(userEntityList[0]);
        });

        test('updatePartialMethod', async () => {
            const res = await userController.updatePartial(
                updatePatchUserDTO,
                'e5b7bc0e-707d-4cd3-a0a9-a292adbffe3d',
            );
            expect(res).toEqual(userEntityList[0]);
        });

        test('deleteMethod', async () => {
            const res = await userController.delete(
                'e5b7bc0e-707d-4cd3-a0a9-a292adbffe3d',
            );
            expect(res).toEqual({ success: true });
        });
    });
});
