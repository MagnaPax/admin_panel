import { Test, TestingModule } from '@nestjs/testing';
import { ManagementsController } from './managements.controller';
import { ManagementsService } from './managements.service';

describe('ManagementsController', () => {
  let controller: ManagementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagementsController],
      providers: [ManagementsService],
    }).compile();

    controller = module.get<ManagementsController>(ManagementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
