import { UserService } from '../user/user.service';

export const userServiceMock = {
    provide: UserService,
    useValue: {
        create: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        updatePartial: jest.fn(),
        delete: jest.fn(),
        exists: jest.fn(),
    },
};
