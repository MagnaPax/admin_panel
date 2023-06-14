import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagementsModule } from './managements/managements.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './orm.config';

@Module({
  imports: [
    ManagementsModule,
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
