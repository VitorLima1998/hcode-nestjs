import { Role } from '../enums/role.enum';
import { CreateUserDTO } from '../user/dto/create-user.dto';

export const createUserDTO: CreateUserDTO = {
    birthAt: '1998-01-31',
    email: 'vitor.lima@gmail.com',
    name: 'Vitor Lima',
    password: 'P@$$w0rd',
    role: Role.User,
};
