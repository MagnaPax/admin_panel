import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagementsModule } from './managements/managements.module';

@Module({
  imports: [ManagementsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
