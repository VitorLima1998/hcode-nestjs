import { Role } from '../enums/role.enum';
import { UpdateUserDTO } from '../user/dto/update-put-user.dto';

export const updateUserDTO: UpdateUserDTO = {
    birthAt: '1998-01-31',
    email: 'vitor.lima@gmail.com',
    name: 'Vitor Lima',
    password: 'P@$$w0rd',
    role: Role.User,
};
