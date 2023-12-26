import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { updateUserDTO } from '../testing/update-put-user-dto.mock';
import { updatePatchUserDTO } from '../testing/update-patch-user-dto.mock';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, userRepositoryMock],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get(getRepositoryToken(UserEntity));
    });

    test('Validate definition', () => {
        expect(userService).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    describe('Create', () => {
        test('method create', async () => {
            jest.spyOn(userRepository, 'exist').mockResolvedValueOnce(false);

            const result = await userService.create(createUserDTO);

            expect(result).toEqual(userEntityList[0]);
        });
    });

    describe('Read', () => {
        test('method findAll', async () => {
            const result = await userService.findAll();

            expect(result).toEqual(userEntityList);
        });

        test('method findOne', async () => {
            const result = await userService.findOne(
                'e5b7bc0e-707d-4cd3-a0a9-a292adbffe3d',
            );

            expect(result).toEqual(userEntityList[0]);
        });
    });
    describe('Update', () => {
        test('method update', async () => {
            const result = await userService.update(
                'e5b7bc0e-707d-4cd3-a0a9-a292adbffe3d',
                updateUserDTO,
            );

            expect(result).toEqual(userEntityList[0]);
        });
        test('method updatePartial', async () => {
            const result = await userService.updatePartial(
                'e5b7bc0e-707d-4cd3-a0a9-a292adbffe3d',
                updatePatchUserDTO,
            );

            expect(result).toEqual(userEntityList[0]);
        });
    });
    describe('Delete', () => {
        test('method updatePartial', async () => {
            const result = await userService.delete(
                'e5b7bc0e-707d-4cd3-a0a9-a292adbffe3d',
            );

            expect(result).toEqual(true);
        });
    });
});
