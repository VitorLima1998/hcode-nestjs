import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entities/user.entity';

export const userEntityList: UserEntity[] = [
    {
        name: 'Vitor Lima',
        email: 'vitor.lima@gmail.com',
        birthAt: new Date('1998-01-31'),
        id: '13d538f9-bc97-4f51-b8d5-a9aa7f2f104e',
        password:
            '$2b$10$Kwu8/Tv/4N6f5owTyR7VpehZ7mgmPv0250vc5A.c0ag.hL./aJEuK',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Vitor',
        email: 'vitor.lima@hotmail.com',
        birthAt: new Date('1998-01-31'),
        id: 'e5b7bc0e-707d-4cd3-a0a9-a292adbffe3d',
        password:
            '$2b$10$LB9artO3BPog531uIWbCRudZSEws98NqvtU3tP7Sef7RjjfnopTTS',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: 'Vitor',
        email: 'vitor@admin.com',
        birthAt: new Date('1998-01-31'),
        id: 'fe1f1a36-2479-4b4c-99a8-f1237d8ff449',
        password:
            '$2b$10$Kwu8/Tv/4N6f5owTyR7VpehZ7mgmPv0250vc5A.c0ag.hL./aJEuK',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
