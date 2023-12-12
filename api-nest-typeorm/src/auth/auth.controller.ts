import {
    BadRequestException,
    Body,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthService } from './auth.service';
import {
    FileFieldsInterceptor,
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';
import { Multer } from 'multer';
import { join } from 'path';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { FileService } from '../file/file.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly fileService: FileService,
    ) {}

    @Post('login')
    async login(@Body() { email, password }: AuthLoginDTO) {
        return this.authService.login(email, password);
    }

    @Post('register')
    async register(@Body() data: AuthRegisterDTO) {
        return this.authService.register(data);
    }

    @Post('forget')
    async forget(@Body() { email }: AuthForgetDTO) {
        return this.authService.forget(email);
    }

    @Post('reset')
    async reset(@Body() { password, token }: AuthResetDTO) {
        return this.authService.reset(password, token);
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User() user) {
        return { user };
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(
        @User() user,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: 'image/*' }),
                    new MaxFileSizeValidator({ maxSize: 1024 * 4096 }),
                ],
            }),
        )
        photo: Multer.File,
    ) {
        const path = join(
            __dirname,
            '..',
            '..',
            'storage',
            'photos',
            `photo=${user.id}.png`,
        );
        try {
            this.fileService.upload(photo, path);
        } catch (error) {
            throw new BadRequestException(error);
        }

        return { success: true };
    }

    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(@User() user, @UploadedFiles() files: Multer.File[]) {
        return files;
    }

    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'photo',
                maxCount: 1,
            },
            {
                name: 'documents',
                maxCount: 10,
            },
        ]),
    )
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async uploadFilesFields(
        @User() user,
        @UploadedFiles()
        files: { photo: Multer.File; documents: Multer.File[] },
    ) {
        return files;
    }
}
