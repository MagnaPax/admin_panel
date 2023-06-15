import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './orm.config';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useFactory: ormConfig }), BrandModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
