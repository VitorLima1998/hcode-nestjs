import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
    async upload(file: Multer.File, path: string) {
        return writeFile(path, file.buffer);
    }
}
