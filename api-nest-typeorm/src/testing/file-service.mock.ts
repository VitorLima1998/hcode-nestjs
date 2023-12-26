import { FileService } from '../file/file.service';
import { userEntityList } from './user-entity-list.mock';

export const fileServiceMock = {
    provide: FileService,
    useValue: {
        getDestinationPath: jest.fn(),
        upload: jest.fn().mockResolvedValue(userEntityList[0]),
    },
};
