import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { isString } from 'class-validator';

@Injectable()
export class AuthService {
    private issuer = 'login';
    private audience = 'users';

    constructor(
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly mailer: MailerService,
    ) {}

    createToken(user: User) {
        return {
            accessToken: this.jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                {
                    expiresIn: process.env.TIMEOUT,
                    subject: user.id,
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
        const user = await this.prisma.user.findFirst({
            where: {
                email,
            },
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
        const user = await this.prisma.user.findFirst({
            where: {
                email,
            },
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

        return true;
    }

    async reset(password: string, token: string) {
        try {
            const data: any = this.jwt.verify(token, {
                audience: 'users',
                issuer: 'forget',
            });

            if (!isString(data.id)) {
                throw new BadRequestException('Invalid Token');
            }

            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);

            const user = await this.prisma.user.update({
                where: {
                    id: data.id,
                },
                data: {
                    password,
                },
            });

            return this.createToken(user);
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async register(data: AuthRegisterDTO) {
        const user = await this.userService.create(data);

        return this.createToken(user);
    }
}
