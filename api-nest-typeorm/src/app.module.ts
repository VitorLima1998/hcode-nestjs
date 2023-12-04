import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_ROOT_USERNAME,
            password: process.env.DB_ROOT_PASSWORD,
            database: process.env.DATABASE,
            entities: [UserEntity],
            synchronize: process.env.ENV === 'development', // apaga dados do db e cria colunas novas de acordo com nossas entities. *Deixe funcionando apenas locaLmente
        }),
        MailerModule.forRoot({
            transport: {
                service: 'gmail',
                auth: {
                    user: 'ifmsinterage@gmail.com ',
                    pass: 'jrbq ufbx cfym hdjx',
                },
            },
            defaults: {
                from: '"NO-REPLY" <no-reply@ifms.interage.edu.br>', //endereço de email que sairá do servidor
            },
            template: {
                dir: __dirname + '/templates', //procura no meu proprio diretorio a pasta templates
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        ConfigModule.forRoot(),
        ThrottlerModule.forRoot([
            {
                ttl: 60,
                limit: 3,
            },
        ]),
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
    exports: [AppService],
})
export class AppModule {}
