import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Multer, diskStorage } from 'multer';

import { FilesService } from './files.service';
import { extname } from 'path';

const options: MulterOptions = {
  storage: diskStorage({
    destination: './storage',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      let filename = file.originalname;

      if (!/^[a-zA-Z0-9_.()-]+$/.test(filename)) {
        // 파일 이름이 영어가 아닌 경우
        const ext = extname(file.originalname);
        filename = `file-${uniqueSuffix}${ext}`;
      } else {
        const ext = extname(file.originalname);
        filename = `${file.originalname}-${uniqueSuffix}${ext}`;
      }

      callback(null, filename);
    },
  }),
  limits: {
    // 파일 사이즈 1MB
    fileSize: 1048576,
  },
};

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', options))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return `file upload API`;
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files', 3, options))
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
  }
}
