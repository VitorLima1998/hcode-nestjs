import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';
config();

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            secret: process.env.SECRET,
        }),
        forwardRef(() => UserModule),
        FileModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
