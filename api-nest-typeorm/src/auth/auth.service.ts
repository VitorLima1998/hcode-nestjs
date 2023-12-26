import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { isString } from 'class-validator';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
config();

@Injectable()
export class AuthService {
    private issuer = 'login';
    private audience = 'users';

    constructor(
        @InjectRepository(UserEntity)
        private readonly authRepository: Repository<UserEntity>,
        private readonly jwt: JwtService,
        private readonly userService: UserService,
        private readonly mailer: MailerService,
    ) {}

    async createToken(user: UserEntity) {
        if (!user) {
            throw new Error('User is undefined');
        }
        return {
            accessToken: this.jwt.sign(
                {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                },
                {
                    expiresIn: 3600 * 24,
                    subject: String(user.id),
                    audience: this.audience,
                    issuer: this.issuer,
                },
            ),
        };
    }

    checkToken(token: string) {
        try {
            const data = this.jwt.verify(token, {
                audience: this.audience,
                issuer: this.issuer,
            });
            return data;
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token);
            return true;
        } catch (e) {
            return false;
        }
    }

    async login(email: string, password: string) {
        const user = await this.authRepository.findOneBy({
            email,
        });

        if (!user) {
            throw new UnauthorizedException(`Invalid e-mail or password.`);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException(`Invalid e-mail or password`);
        }

        return this.createToken(user);
    }

    async forget(email: string) {
        const user = await this.authRepository.findOneBy({
            email,
        });

        if (!user) {
            throw new UnauthorizedException(`Incorrect e-mail`);
        }

        const token = this.jwt.sign(
            {
                id: user.id,
            },
            {
                expiresIn: process.env.FORGET_PASSWORD_TIMEOUT,
                subject: user.id,
                audience: 'users',
                issuer: 'forget',
            },
        );

        await this.mailer.sendMail({
            subject: 'Password Reset',
            to: user.email,
            template: 'forget',
            context: {
                name: user.name,
                token,
            },
        });

        return { success: true };
    }

    async reset(password: string, token: string) {
        try {
            const data: any = this.jwt.verify(token, {
                issuer: 'forget',
                audience: 'users',
            });

            if (!isString(data.id)) {
                throw new BadRequestException('Invalid Token');
            }

            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);

            await this.authRepository.update(String(data.id), {
                password,
            });

            const user = await this.userService.findOne(String(data.id));

            return this.createToken(user);
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async register(data: AuthRegisterDTO) {
        delete data.role;

        const user = await this.userService.create(data);

        return this.createToken(user);
    }
}
