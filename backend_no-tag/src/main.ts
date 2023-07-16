import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 클라이언트에서 보낸 쿼리'스트링'을 컨트롤러에서 알맞는 자료형으로 바꿀 수 있게
    }),
  );
  app.enableCors();
  await app.listen(5425);
}
bootstrap();
