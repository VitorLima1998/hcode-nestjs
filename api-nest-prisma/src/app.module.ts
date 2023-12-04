import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
    imports: [
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
