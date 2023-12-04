import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {}

    async create(data: CreateUserDTO) {
        if (
            await this.usersRepository.exist({
                where: {
                    email: data.email,
                },
            })
        ) {
            throw new BadRequestException('Email already exists.');
        }

        const salt = await bcrypt.genSalt();

        data.password = await bcrypt.hash(data.password, salt);

        const user = this.usersRepository.create(data);

        return this.usersRepository.save(user);
    }

    async findAll() {
        return this.usersRepository.find();
    }

    async findOne(id: string) {
        await this.exists(id);

        return this.usersRepository.findOneBy({
            id,
        });
    }

    async update(
        id: string,
        { email, name, password, birthAt, role }: UpdatePatchUserDTO,
    ) {
        await this.exists(id);

        const salt = await bcrypt.genSalt();

        password = await bcrypt.hash(password, salt);

        await this.usersRepository.update(id, {
            email,
            name,
            password,
            birthAt: birthAt ? new Date(birthAt) : null,
            role,
        });

        return this.findOne(id);
    }

    async updatePartial(
        id: string,
        { email, name, password, birthAt, role }: UpdatePatchUserDTO,
    ) {
        await this.exists(id);

        const data: any = {};

        if (birthAt) {
            data.birthAt = new Date(birthAt);
        }

        if (email) {
            data.email = email;
        }

        if (name) {
            data.name = name;
        }

        if (password) {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(password, salt);
        }

        if (role) {
            data.role = role;
        }

        await this.usersRepository.update(id, data);

        return this.findOne(id);
    }

    async delete(id: string) {
        await this.exists(id);

        await this.usersRepository.delete(id);

        return true;
    }

    async exists(id: string) {
        if (
            !(await this.usersRepository.exist({
                where: {
                    id,
                },
            }))
        ) {
            throw new NotFoundException(`O usuário ${id} não existe.`);
        }
    }
}
