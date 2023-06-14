import { Test, TestingModule } from '@nestjs/testing';
import { ManagementsService } from './managements.service';

describe('ManagementsService', () => {
  let service: ManagementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagementsService],
    }).compile();

    service = module.get<ManagementsService>(ManagementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
