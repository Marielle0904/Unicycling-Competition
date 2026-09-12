import { Test, TestingModule } from '@nestjs/testing';
import { VereineService } from './vereine.service';

describe('VereineService', () => {
  let service: VereineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VereineService],
    }).compile();

    service = module.get<VereineService>(VereineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
